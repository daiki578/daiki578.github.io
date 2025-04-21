function sayHi() {
  const greetings = [
    "はじめまして！daikiです👋",
    "みんなも沢山アニメを見よう！",
    "今日も１日頑張ろう！",
    "Hello from daiki 🚀"
  ];
  const index = Math.floor(Math.random() * greetings.length);
  document.getElementById("message").textContent = greetings[index];
}
