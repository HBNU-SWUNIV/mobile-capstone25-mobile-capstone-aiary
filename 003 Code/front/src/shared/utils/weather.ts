export const getWeatherDescription = (code: number): string => {
  if (code === 0) return '☀️ 맑음';
  if (code >= 1 && code <= 3) return '☁️ 흐림';
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return '🌧️ 비';
  if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return '❄️ 눈';
  if (code >= 95 && code <= 99) return '⚡ 천둥번개';
  if (code >= 45 && code <= 48) return '🌫️ 안개';
  return '알 수 없음';
};

export const getWeatherColor = (description?: string): string => {
  if (!description) {
    return '#FFFFFF'; // 기본값 (흰색)
  }

  if (description.includes('맑음')) {
    return '#FFF3E0'; // 맑음 (따뜻한 크림색)
  }
  if (description.includes('흐림')) {
    return '#EEEEEE'; // 흐림 (밝은 회색)
  }
  if (description.includes('비')) {
    return '#B0BEC5'; // 비 (차분한 파란 회색)
  }
  if (description.includes('눈')) {
    return '#F5FAFE'; // 눈 (매우 밝은 파란색)
  }
  if (description.includes('천둥번개')) {
    return '#424242'; // 천둥번개 (어두운 회색)
  }
  if (description.includes('안개')) {
    return '#CFD8DC'; // 안개 (안개 낀 회색)
  }
  
  return '#FFFFFF'; // 그 외 (흰색)
};

export const getWeatherTextColor = (description?: string): string => {
  if (!description) return '#212121'; // 기본값 (진한 회색)
  
  if (description.includes('맑음')) {
    return '#F57C00'; // 맑음 (진한 주황색)
  }
  if (description.includes('흐림')) {
    return '#424242'; // 흐림 (어두운 회색)
  }
  if (description.includes('비')) {
    return '#263238'; // 비 (매우 어두운 파란 회색)
  }
  if (description.includes('눈')) {
    return '#0D47A1'; // 눈 (진한 파란색)
  }
  if (description.includes('천둥번개')) {
    return '#FAFAFA'; // 천둥번개 (밝은 회색/흰색) - 배경이 어두우니까
  }
  if (description.includes('안개')) {
    return '#37474F'; // 안개 (어두운 파란 회색)
  }
  
  return '#212121'; // 그 외 (진한 회색)
};