function sayHi() {
  const greetings = [
    "はじめまして！Kaiです👋",
    "コードで世界を変えよう！",
    "今日も一歩前進！",
    "Hello from Kai 🚀"
  ];
  const index = Math.floor(Math.random() * greetings.length);
  document.getElementById("message").textContent = greetings[index];
}
