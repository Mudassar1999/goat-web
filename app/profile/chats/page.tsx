import Footer from "@/components/Footer";
import Chat from "../components/messages/Chat";
import Header from "@/components/Header";
import { Suspense } from "react";

function Chats() {
  return (
    <>
      <Header />
      <Suspense>
        <Chat />
      </Suspense>
      <Footer />
    </>
  );
}
export default Chats;
