import { Helmet } from "react-helmet";
import { ChatGPTFlow1ZeroFriction } from "@/components/calculator-variants/ChatGPTFlow1ZeroFriction";

const ChatGPTFlow1 = () => (
  <div className="min-h-screen bg-background">
    <Helmet>
      <title>ChatGPT Flow 1 | Zero Friction Pro | Umzugscheck.ch</title>
      <meta name="robots" content="noindex, nofollow" />
    </Helmet>
    <ChatGPTFlow1ZeroFriction />
  </div>
);

export default ChatGPTFlow1;
