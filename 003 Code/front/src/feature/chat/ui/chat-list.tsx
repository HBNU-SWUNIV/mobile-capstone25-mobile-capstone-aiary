import { useLocalSearchParams } from "expo-router";
import { useMemo, useRef } from "react";
import { FlatList, Keyboard, View } from "react-native";
import { useChatList } from "../hooks/use-chat";
import { useChatEvents } from "../hooks/use-chat-event";
import type { Chat } from "../types/chat";
import DateDivider from "./date-divider";
import ChatMessage from "./message/chat-message";

type ChatListItem = { type: "message"; data: Chat } | { type: "date"; data: { date: string; id: string } };

const ChatList = () => {
  const { id: threadId } = useLocalSearchParams<{ id: string }>();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useChatList(threadId);
  useChatEvents(threadId);

  const chatList: Chat[] = data?.pages?.flatMap((page) => page.items) ?? [];
  const sortedChatList = useMemo(
    () => [...chatList].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()).reverse(),
    [chatList]
  );

  const chatListWithDateDividers = useMemo(() => {
    const items: ChatListItem[] = [];
    for (let i = 0; i < sortedChatList.length; i++) {
      const currentMessage = sortedChatList[i];
      const nextMessage = sortedChatList[i + 1];
      const currentDate = new Date(currentMessage.createdAt);
      const nextDate = nextMessage ? new Date(nextMessage.createdAt) : null;

      items.push({ type: "message", data: currentMessage });

      if (!nextDate || !isSameDay(currentDate, nextDate)) {
        items.push({
          type: "date",
          data: {
            date: formatDate(currentDate),
            id: `date-${currentDate.toDateString()}`,
          },
        });
      }
    }
    return items;
  }, [sortedChatList]);

  const renderItem = ({ item }: { item: ChatListItem }) =>
    item.type === "date" ? <DateDivider date={item.data.date} /> : <ChatMessage item={item.data} />;

  const scrollViewRef = useRef<FlatList<ChatListItem>>(null);

  return (
    <FlatList
      data={chatListWithDateDividers}
      renderItem={renderItem}
      keyExtractor={(item) => item.data.id}
      onTouchStart={() => Keyboard.dismiss()}
      inverted
      style={{ paddingHorizontal: 16, width: "100%", flex: 1 }}
      contentContainerStyle={{ gap: 12, flexGrow: 1 }}
      onEndReached={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
      onEndReachedThreshold={0.7}
      ref={scrollViewRef}
      ListFooterComponent={<View style={{ height: 20 }} />}
      ListHeaderComponent={<View style={{ height: 20 }} />}
      automaticallyAdjustContentInsets={false}
      keyboardShouldPersistTaps="handled"
      contentInsetAdjustmentBehavior="never"
      maintainVisibleContentPosition={{
        minIndexForVisible: 0,
        autoscrollToTopThreshold: 80,
      }}
      automaticallyAdjustKeyboardInsets
    />
  );
};

const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    new Date(date1.getFullYear(), date1.getMonth(), date1.getDate()).getTime() ===
    new Date(date2.getFullYear(), date2.getMonth(), date2.getDate()).getTime()
  );
};

const formatDate = (date: Date): string => {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (isSameDay(date, today)) return "오늘";
  if (isSameDay(date, yesterday)) return "어제";
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
};

export default ChatList;
