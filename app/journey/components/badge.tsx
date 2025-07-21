import React from "react";
import { useJourney } from "@/providers/JourneyProvider";

function BadgeComponent() {
  const { journey } = useJourney();

  if (!journey || !journey.badges) {
    return null;
  }

  const currentIndex = journey.badges.findIndex(
    (badge: any) => badge.id === journey.currentBadgeId
  );

  const previousBadge =
    currentIndex > 0
      ? journey.badges[currentIndex - 1]
      : journey.badges[journey.badges.length - 1];
  const currentBadge = journey.badges[currentIndex];
  const nextBadge =
    currentIndex < journey.badges.length - 1
      ? journey.badges[currentIndex + 1]
      : null;

  if (!currentBadge) {
    return null;
  }

  return (
    <div className="w-[358px]  bg-[#1C1C1E] mx-auto px-[16px] py-[24px] rounded-[14px] flex flex-col gap-[16px]">
      <div className="badge-scroll h-[131px]">
        <div className={`flex overflow-hidden overflow-x-auto`}>
          {journey.badges.map((data: any, index: number) => {
            const isCurrentBadge = journey?.currentBadgeId === data?.id;
            const isPreviousBadge =
              index <
              journey?.badges?.findIndex(
                (badge: any) => badge?.id === journey?.currentBadgeId
              );
            const isNextBadge =
              index >
              journey?.badges?.findIndex(
                (badge: any) => badge?.id === journey?.currentBadgeId
              );

            return (
              <div
                key={data?.id}
                className={`flex flex-col gap-[16px] min-w-[121px] items-center ${
                  journey?.currentBadgeId === data?.id && index === 0
                    ? "ml-[100px]"
                    : ""
                }`}
              >
                <div
                  className={`w-[71px] h-[80px] object-fit rounded transition-opacity ${
                    isCurrentBadge ? "" : "opacity-50"
                  }`}
                >
                  <img
                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${data?.imageUrl}`}
                    alt={data?.name}
                    className="object-cover rounded"
                  />
                </div>

                <div>
                  <p
                    className={`transition-opacity text-center text-11 color-gray ${
                      isCurrentBadge ? "" : "opacity-50"
                    }`}
                  >
                    {isCurrentBadge
                      ? "Current Rank"
                      : isPreviousBadge
                        ? "Previous Rank"
                        : isNextBadge
                          ? "Next Rank"
                          : ""}
                  </p>

                  <p
                    className={`text-center text-15 ${
                      isCurrentBadge ? "text-17-bold color-green" : "opacity-50"
                    }`}
                  >
                    {data?.name}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-[12px] mx-[5px]">
        <div className="w-[52%] relative h-[3px] rounded overflow-hidden bg-[#545458a6]">
          <div
            className="h-full bg-[#9FE870]"
            style={{
              width: `${((5 - journey.drillsLeftForNextBadge) / 5) * 100}%`,
            }}
          ></div>
        </div>
        <div className="ml-auto text-13 color-white">
          {journey?.drillsLeftForNextBadge} drills to the next rank
        </div>
      </div>

      {/* Comment like */}
      {/* <ul className="commentInfo-ul">
        <li className="commentInfo-li">
          <div className="commentInfo-userImg-otr">
            <img
              className="commentInfo-userImg"
              src="https://images.unsplash.com/photo-1705789546054-fb2105887ab8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw0fHx8ZW58MHx8fHx8"
              alt="img"
            />
          </div>
          <p className="commentInfo-userName">Matthewheil21</p>
        </li>
        <li className="commentInfo-li">
          <div className="commentInfo-userImg-otr">
            <img
              className="commentInfo-userImg"
              src="https://images.unsplash.com/photo-1705789546054-fb2105887ab8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw0fHx8ZW58MHx8fHx8"
              alt="img"
            />
          </div>
          <p className="commentInfo-userName">Matthewheil21</p>
        </li>
        <li className="commentInfo-li">
          <div className="commentInfo-userImg-otr">
            <img
              className="commentInfo-userImg"
              src="https://images.unsplash.com/photo-1705789546054-fb2105887ab8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw0fHx8ZW58MHx8fHx8"
              alt="img"
            />
          </div>
          <p className="commentInfo-userName">Matthewheil21</p>
        </li>
      </ul> */}
      {/* Comment like */}

      {/* Follow */}

      {/* <div className="followPopup-otr">
        <div className="followPopup-inr">
          <div className="followPopup-userImag-otr">
            <img
              className="followPopup-userImag"
              src="https://images.unsplash.com/photo-1682695794947-17061dc284dd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHw2fHx8ZW58MHx8fHx8"
              alt="img"
            />
            <div className="followPopup-clubImg-otr">
              <img
                className="followPopup-clubImg"
                src="https://images.unsplash.com/photo-1705407193485-98a3cca5d125?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxOHx8fGVufDB8fHx8fA%3D%3D"
                alt="img"
              />
            </div>
          </div>
          <div className="followPopup-content">
            <p className="followPopup-UserName">Ahmed Ehab</p>
            <p className="followPopup-UserDesc">Username</p>
            <div className="followPopup-actions">
              <div className="followPopup-btn-otr">
                <div className="followPopup-btn">Messsage</div>
              </div>
              <div className="followPopup-btn-otr">
                <div className="followPopup-btn">
                  <div className="followPopup-btnIcon">+</div>
                  Follow
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* Follow */}
    </div>
  );
}

export default BadgeComponent;
