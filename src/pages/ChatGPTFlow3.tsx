import { Helmet } from "react-helmet";
import { ChatGPTFlow3GuidedChat } from "@/components/calculator-variants/ChatGPTFlow3GuidedChat";

const ChatGPTFlow3 = () => (
  <div className="min-h-screen bg-background">
    <Helmet>
      <title>ChatGPT Flow 3 | Guided Chat | Umzugscheck.ch</title>
      <meta name="robots" content="noindex, nofollow" />
    </Helmet>
    <ChatGPTFlow3GuidedChat />
  </div>
);

export default ChatGPTFlow3;
