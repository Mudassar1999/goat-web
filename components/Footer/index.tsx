import AppleIcon from "@/assests/svg/appleIcon";
import GoogleIcon from "@/assests/svg/googleIcon";
import Image from "next/image";
import Link from "next/link";
import "./footer.scss"

const footerData = [
  {
    "title": "Company",
    "tag1": "About us",
    "tag2": "Careers",
    "tag3": "Press",
    "tag4": "News",
    "tag5": "Media kit",
    "tag6": "Contact",
  },
  {
    "title": "Resources",
    "tag1": "Blog",
    "tag2": "Newsletter",
    "tag3": "Help centre",
    "tag4": "Register as a Club",
    "tag5": "Support",
  },
  {
    "title": "Social",
    "tag1": "Twitter",
    "tag2": "LinkedIn",
    "tag3": "Facebook",
  },
  {
    "title": "Legal",
    "tag1": "Terms",
    "tag2": "Privacy",
    "tag3": "Cookies",
    "tag4": "Licenses",
    "tag5": "Settings",
    "tag6": "Contact",
  },
]

const Footer = () => {
  return (
    <>
      {/* <footer>
        <div className="inline-flex w-full flex-col items-center justify-start gap-16 pb-12 pt-16">
          <div className="flex h-48 flex-col items-start justify-start gap-12 self-stretch px-8">
            <div className="inline-flex items-start justify-start gap-8 self-stretch">
              <div className="flex h-48 shrink grow basis-0 items-start justify-start gap-8 flex-wrap">
                <div className="inline-flex shrink grow basis-0 flex-col items-start justify-start gap-4">
                  <h2 className="font-['SF Pro Text'] self-stretch text-base font-semibold leading-tight text-gray-300">
                    Company
                  </h2>
                  <div className="flex h-40 flex-col items-start justify-start gap-3 self-stretch">
                    <div className="inline-flex items-center justify-start gap-2">
                      <div className="flex items-center justify-center gap-2">
                        <div className="font-['SF Pro Text'] text-xs font-medium leading-none text-gray-200">
                          About us
                        </div>
                      </div>
                    </div>
                    <div className="inline-flex items-center justify-start gap-2">
                      <div className="flex items-center justify-center gap-2">
                        <div className="font-['SF Pro Text'] text-xs font-medium leading-none text-gray-200">
                          Careers
                        </div>
                      </div>
                    </div>
                    <div className="inline-flex items-center justify-start gap-2">
                      <div className="flex items-center justify-center gap-2">
                        <div className="font-['SF Pro Text'] text-xs font-medium leading-none text-gray-200">
                          Press
                        </div>
                      </div>
                    </div>
                    <div className="inline-flex items-center justify-start gap-2">
                      <div className="flex items-center justify-center gap-2">
                        <div className="font-['SF Pro Text'] text-xs font-medium leading-none text-gray-200">
                          News
                        </div>
                      </div>
                    </div>
                    <div className="inline-flex items-center justify-start gap-2">
                      <div className="flex items-center justify-center gap-2">
                        <div className="font-['SF Pro Text'] text-xs font-medium leading-none text-gray-200">
                          Media kit
                        </div>
                      </div>
                    </div>
                    <div className="inline-flex items-center justify-start gap-2">
                      <div className="flex items-center justify-center gap-2">
                        <div className="font-['SF Pro Text'] text-xs font-medium leading-none text-gray-200">
                          Contact
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="inline-flex shrink grow basis-0 flex-col items-start justify-start gap-4">
                  <h2 className="font-['SF Pro Text'] self-stretch text-base font-semibold leading-tight text-gray-300">
                    Resources
                  </h2>
                  <div className="flex h-32 flex-col items-start justify-start gap-3 self-stretch">
                    <div className="inline-flex items-center justify-start gap-2">
                      <div className="flex items-center justify-center gap-2">
                        <div className="font-['SF Pro Text'] text-xs font-medium leading-none text-gray-200">
                          Blog
                        </div>
                      </div>
                    </div>
                    <div className="inline-flex items-center justify-start gap-2">
                      <div className="flex items-center justify-center gap-2">
                        <div className="font-['SF Pro Text'] text-xs font-medium leading-none text-gray-200">
                          Newsletter
                        </div>
                      </div>
                    </div>
                    <div className="inline-flex items-center justify-start gap-2">
                      <div className="flex items-center justify-center gap-2">
                        <div className="font-['SF Pro Text'] text-xs font-medium leading-none text-gray-200">
                          Help centre
                        </div>
                      </div>
                    </div>
                    <div className="inline-flex items-center justify-start gap-2">
                      <div className="flex items-center justify-center gap-2">
                        <div className="font-['SF Pro Text'] text-xs font-medium leading-none text-gray-200">
                          Tutorials
                        </div>
                      </div>
                    </div>
                    <div className="inline-flex items-center justify-start gap-2">
                      <div className="flex items-center justify-center gap-2">
                        <div className="font-['SF Pro Text'] text-xs font-medium leading-none text-gray-200">
                          Support
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="inline-flex shrink grow basis-0 flex-col items-start justify-start gap-4">
                  <h2 className="font-['SF Pro Text'] self-stretch text-base font-semibold leading-tight text-gray-300">
                    Social
                  </h2>
                  <div className="flex h-40 flex-col items-start justify-start gap-3 self-stretch">
                    <div className="inline-flex items-center justify-start gap-2">
                      <div className="flex items-center justify-center gap-2">
                        <div className="font-['SF Pro Text'] text-xs font-medium leading-none text-gray-200">
                          Twitter
                        </div>
                      </div>
                    </div>
                    <div className="inline-flex items-center justify-start gap-2">
                      <div className="flex items-center justify-center gap-2">
                        <div className="font-['SF Pro Text'] text-xs font-medium leading-none text-gray-200">
                          LinkedIn
                        </div>
                      </div>
                    </div>
                    <div className="inline-flex items-center justify-start gap-2">
                      <div className="flex items-center justify-center gap-2">
                        <div className="font-['SF Pro Text'] text-xs font-medium leading-none text-gray-200">
                          Facebook
                        </div>
                      </div>
                    </div>
                    <div className="inline-flex items-center justify-start gap-2">
                      <div className="flex items-center justify-center gap-2">
                        <div className="font-['SF Pro Text'] text-xs font-medium leading-none text-gray-200">
                          GitHub
                        </div>
                      </div>
                    </div>
                    <div className="inline-flex items-center justify-start gap-2">
                      <div className="flex items-center justify-center gap-2">
                        <div className="font-['SF Pro Text'] text-xs font-medium leading-none text-gray-200">
                          AngelList
                        </div>
                      </div>
                    </div>
                    <div className="inline-flex items-center justify-start gap-2">
                      <div className="flex items-center justify-center gap-2">
                        <div className="font-['SF Pro Text'] text-xs font-medium leading-none text-gray-200">
                          Dribbble
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="inline-flex shrink grow basis-0 flex-col items-start justify-start gap-4">
                  <h2 className="font-['SF Pro Text'] self-stretch text-base font-semibold leading-tight text-gray-300">
                    Legal
                  </h2>
                  <div className="flex h-40 flex-col items-start justify-start gap-3 self-stretch">
                    <div className="inline-flex items-center justify-start gap-2">
                      <div className="flex items-center justify-center gap-2">
                        <div className="font-['SF Pro Text'] text-xs font-medium leading-none text-gray-200">
                          Terms
                        </div>
                      </div>
                    </div>
                    <div className="inline-flex items-center justify-start gap-2">
                      <div className="flex items-center justify-center gap-2">
                        <div className="font-['SF Pro Text'] text-xs font-medium leading-none text-gray-200">
                          Privacy
                        </div>
                      </div>
                    </div>
                    <div className="inline-flex items-center justify-start gap-2">
                      <div className="flex items-center justify-center gap-2">
                        <div className="font-['SF Pro Text'] text-xs font-medium leading-none text-gray-200">
                          Cookies
                        </div>
                      </div>
                    </div>
                    <div className="inline-flex items-center justify-start gap-2">
                      <div className="flex items-center justify-center gap-2">
                        <div className="font-['SF Pro Text'] text-xs font-medium leading-none text-gray-200">
                          Licenses
                        </div>
                      </div>
                    </div>
                    <div className="inline-flex items-center justify-start gap-2">
                      <div className="flex items-center justify-center gap-2">
                        <div className="font-['SF Pro Text'] text-xs font-medium leading-none text-gray-200">
                          Settings
                        </div>
                      </div>
                    </div>
                    <div className="inline-flex items-center justify-start gap-2">
                      <div className="flex items-center justify-center gap-2">
                        <div className="font-['SF Pro Text'] text-xs font-medium leading-none text-gray-200">
                          Contact
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="inline-flex w-48 flex-col items-start justify-start gap-4">
                <div className="self-stretch font-['Inter'] text-sm font-semibold leading-tight text-white">
                  Get the app
                </div>
                <div className="flex flex-col items-start justify-start gap-4">
                  <AppleIcon />
                  <GoogleIcon />
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer> */}
      <footer>
        <div className="footer-otr">
          <div className="footer-inr">
            <div className="row-footer">
              {footerData.map((data: any , index:number) => (
                <div className="box1-otr"  key={data.id || index}>
                  <div className="box-inr">
                    <div>
                      <p className="box1-heading footer-text-bold-15 color-gray-300 ">{data.title}</p>
                      <ul className="ul-box1">
                        <li className="li-box1">
                          <p className="item-box1 text-12-bold color-gray-200">{data.tag1}</p>
                        </li>
                        <li className="li-box1">
                          <p className="item-box1 text-12-bold color-gray-200">{data.tag2}</p>
                        </li>
                        <li className="li-box1">
                          <p className="item-box1 text-12-bold color-gray-200">{data.tag3}</p>
                        </li>
                        <li className="li-box1">
                          <p className="item-box1 text-12-bold color-gray-200">{data.tag4}</p>
                        </li>
                        <li className="li-box1">
                          <p className="item-box1 text-12-bold color-gray-200">{data.tag5}</p>
                        </li>
                        <li className="li-box1">
                          <p className="item-box1 text-12-bold color-gray-200">{data.tag6}</p>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
              <div className="box1-otr">
                <div className="box-inr">
                  <p className="box1-heading text-15-bold color-white">Get the app</p>
                  <div className="flex flex-col items-start justify-start gap-4">
                    <AppleIcon />
                    <GoogleIcon />
                  </div>
                </div>
              </div>
            </div>


            {/* SOCIAL MEDIA ICONS */}


            {/* <div className="box1-otr">
              <div className="box-inr">
                <p className="box1-heading">Company</p>
                <ul className="ul-box1">
                  <li className="li-box1">
                    <p className="item-box1">Company</p>
                  </li>
                  <li className="li-box1">
                    <p className="item-box1">Company</p>
                  </li>
                  <li className="li-box1">
                    <p className="item-box1">Company</p>
                  </li>
                  <li className="li-box1">
                    <p className="item-box1">Company</p>
                  </li>
                  <li className="li-box1">
                    <p className="item-box1">Company</p>
                  </li>
                </ul>
              </div>
            </div>
            <div className="box1-otr">
              <div className="box-inr">
                <p className="box1-heading">Company</p>
                <ul className="ul-box1">
                  <li className="li-box1">
                    <p className="item-box1">Company</p>
                  </li>
                  <li className="li-box1">
                    <p className="item-box1">Company</p>
                  </li>
                  <li className="li-box1">
                    <p className="item-box1">Company</p>
                  </li>
                  <li className="li-box1">
                    <p className="item-box1">Company</p>
                  </li>
                  <li className="li-box1">
                    <p className="item-box1">Company</p>
                  </li>
                </ul>
              </div>
            </div>
            <div className="box1-otr">
              <div className="box-inr">
                <p className="box1-heading">Company</p>
                <ul className="ul-box1">
                  <li className="li-box1">
                    <p className="item-box1">Company</p>
                  </li>
                  <li className="li-box1">
                    <p className="item-box1">Company</p>
                  </li>
                  <li className="li-box1">
                    <p className="item-box1">Company</p>
                  </li>
                  <li className="li-box1">
                    <p className="item-box1">Company</p>
                  </li>
                  <li className="li-box1">
                    <p className="item-box1">Company</p>
                  </li>
                </ul>
              </div>
            </div>
            <div className="box1-otr">
              <div className="box-inr">
                <p className="box1-heading">Company</p>
                <ul className="ul-box1">
                  <li className="li-box1">
                    <p className="item-box1">Company</p>
                  </li>
                  <li className="li-box1">
                    <p className="item-box1">Company</p>
                  </li>
                  <li className="li-box1">
                    <p className="item-box1">Company</p>
                  </li>
                  <li className="li-box1">
                    <p className="item-box1">Company</p>
                  </li>
                  <li className="li-box1">
                    <p className="item-box1">Company</p>
                  </li>
                </ul>
              </div>
            </div> */}
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
