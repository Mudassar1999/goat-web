import Footer from "../components/Footer";
import Header from "../components/Header";
import ScrollToTop from "../components/ScrollToTop";
// import "node_modules/react-modal-video/css/modal-video.css";
import "./globals.css";
import "../styles/index.css";
import { Providers } from "./providers";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./globals.css";
import "../styles/index.css";
import "react-toastify/dist/ReactToastify.css";
import "./data-tables-css.css";
import "./satoshi.css";
import { PostsProvider } from "@/providers/PostsProvider";
import { SearchProvider } from "@/providers/SearchProvider";
import { NotificationsProvider } from "@/providers/NotificationProvider";
import { SearchTabProvider } from "@/providers/SearchTabProvider";
import { LogsProvider } from "@/providers/LogsProvider";
import { JourneyProvider } from "@/providers/JourneyProvider";
import { GoatDrillProvider } from "@/providers/GoatDrillsProvider";
import { FormProvider } from "@/providers/FormProvider";
import { ProfileProvider } from "@/providers/ProfileProvider";
import { NetworkProvider } from "@/providers/NetworkSuggestionProvider";
import { ExperienceFormProvider } from "@/providers/ExperienceFormProvider";
import { TrophyFormProvider } from "@/providers/TrophyFormProvider";
import { PostsPaginationProvider } from "@/providers/PostsPaginationProvider";
import { sfProDisplay, sfProText } from "@/public/fonts/fonts";
import "@/public/NewFonts/fonts.css";
import { FavoritesPaginationProvider } from "@/providers/FavoritesPaginationProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      suppressHydrationWarning
      lang="en"
      className={`${sfProText.className} ${sfProText.variable} ${sfProDisplay.variable}`}
    >
      <body className="bg-[#111111]" suppressHydrationWarning={true}>
        <ProfileProvider>
          <NetworkProvider>
            <NotificationsProvider>
              <FormProvider>
                <ExperienceFormProvider>
                  <TrophyFormProvider>
                    <GoatDrillProvider>
                      <JourneyProvider>
                        <LogsProvider>
                          <FavoritesPaginationProvider>
                            <PostsPaginationProvider>
                              <PostsProvider>
                                <SearchTabProvider>
                                  <SearchProvider>
                                    <Providers>{children}</Providers>
                                  </SearchProvider>
                                </SearchTabProvider>
                                <ToastContainer />
                              </PostsProvider>
                            </PostsPaginationProvider>
                          </FavoritesPaginationProvider>
                        </LogsProvider>
                      </JourneyProvider>
                    </GoatDrillProvider>
                  </TrophyFormProvider>
                </ExperienceFormProvider>
              </FormProvider>
            </NotificationsProvider>
          </NetworkProvider>
        </ProfileProvider>
      </body>
    </html>
  );
}
