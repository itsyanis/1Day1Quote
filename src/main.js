import "./assets/main.css";
import { createApp } from "vue";
import { createHead } from "@vueuse/head";
import { inject } from "@vercel/analytics";
import App from "./App.vue";

const app = createApp(App);
const head = createHead();
inject({
  mode: "production",
});

app.use(head);
app.mount("#app");
