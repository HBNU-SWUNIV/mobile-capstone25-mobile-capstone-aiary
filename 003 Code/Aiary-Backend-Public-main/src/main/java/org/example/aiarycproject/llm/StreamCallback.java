package org.example.aiarycproject.llm;

public interface StreamCallback {
    void onDelta(String text);
    void onComplete(String full);
    void onError(Throwable t);
}