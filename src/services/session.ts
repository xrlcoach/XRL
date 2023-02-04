export function GetData(dataName: string): string | undefined {
  const data = sessionStorage.getItem(dataName);
  if (data) {
    const expiry = sessionStorage.getItem(dataName + 'Expiry');
    if (expiry && new Date(expiry) > new Date()) {
      return data;
    }
  }
  return undefined;
}

export function SetData(dataName: string, data: string): void {
  sessionStorage.setItem(dataName, data);
  const currentTime = new Date();
  currentTime.setHours(currentTime.getHours() + 1);
  sessionStorage.setItem(dataName + 'Expiry', currentTime.toString());
}