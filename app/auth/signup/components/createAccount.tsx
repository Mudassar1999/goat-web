import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { auth } from "../../../firbase";
import {
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
} from "firebase/auth";
import { Images } from "@/public/Images";
import "./AllComponent.scss";
import { useForm } from "@/providers/FormProvider";

const CreateAccount = ({
  setCurrentStep,
  signupFormState,
  setSignupFormState,
}: any) => {
  const [value, setValue] = useState<any>("");
  const { formState } = useForm();
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const continueWithMobileNumber = () => {
    setCurrentStep(2);
  };

  const continueWithGoogle = () => {
    if (isAuthenticating) return; // Prevent multiple clicks

    setIsAuthenticating(true); // Set loading true
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((data: any) => {
        setSignupFormState({
          ...signupFormState,
          email: data.user.email,
        });
        setCurrentStep(2);
        setValue(data.user.email);
        localStorage.setItem("email", data.user.email);
      })
      .catch((error: any) => {
        console.error("Error during document search:", error);
      })
       .finally(() => {
        setIsAuthenticating(false); // Always reset
      });
  };
  const continueWithFacebook = () => {
    const provider = new FacebookAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        // The signed-in user info.
        provider.addScope("email");
        const user = result.user;
        setSignupFormState({
          ...signupFormState,
          email: user?.providerData[0]?.email,
        });
        setCurrentStep(2);
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        const credential = FacebookAuthProvider.credentialFromResult(result);
        const accessToken = credential?.accessToken;

        // IdP data available using getAdditionalUserInfo(result)
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        console.log(error, "error");
        // The AuthCredential type that was used.
        const credential = FacebookAuthProvider.credentialFromError(error);

        // ...
      });
  };
  const continueWithApple = () => {
    const provider = new OAuthProvider("apple.com");
    signInWithPopup(auth, provider)
      .then((result) => {
        // The signed-in user info.
        provider.addScope("email");
        const user = result.user;
        console.log(user);
        // Apple credential
        const credential = OAuthProvider.credentialFromResult(result);
        const accessToken = credential?.accessToken;
        const idToken = credential?.idToken;
        console.log(accessToken, idToken);
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The credential that was used.
        const credential = OAuthProvider.credentialFromError(error);

        // ...
      });
  };

  useEffect(() => {
    if (formState.phoneNumber !== "") {
      window.location.reload();
    }
  }, []);

  return (
    <>
      <div className="main-createAccount">
        {/* <p className="sf-pro-display">Usman Tappu</p>
        <p className="sfProDisplay">Usman Tappu</p>
        <p className="sfProDisplay">Usman Tappu</p>
        <p className="sfProDisplay">Usman Tappu</p>
        <p className="sfProDisplay">Usman Tappu</p>
        <p className="tryFont2">SF Pro Text</p>
        <p className="tryFont3">Continue with Phone Number</p> */}
        <h2 className="heading-bold heading-main-createAccount">
          Create an account
        </h2>
        <p className="desc desc-main-createAccount">
          Choose a sign up method to get started and use GOAT.
        </p>
        <div className="contact-btn-otr">
          <div className="contact-btn-inr" onClick={continueWithMobileNumber}>
            <Image src={Images.phone} alt="" className="contact-icon" />
            Continue with Phone Number
          </div>
        </div>
        <div className="social-heading-otr">
          <span className="line"></span>
          <p className="heading-s social-heading">or</p>
          <span className="line"></span>
        </div>
        <div className="creat-Account-btn-otr">
          <div className="theme-otr">
            <div className="theme-inr" onClick={continueWithGoogle}>
              <Image src={Images.google} alt="" className="social-icon" />
              Continue with Google
            </div>
          </div>
          <div className="theme-otr">
            <div className="theme-inr" onClick={continueWithFacebook}>
              <Image src={Images.facebook} alt="" className="social-icon" />
              Continue with Facebook
            </div>
          </div>
          <div className="theme-otr">
            <div className="theme-inr" onClick={continueWithApple}>
              <Image src={Images.apple} alt="" className="social-icon" />
              Continue with Apple
            </div>
          </div>
        </div>
        <p className="last-desc">
          By continuing, you agree to our
          <Link
            href="https://technupur.com"
            target="_blank"
            className="!text-[#0A84FF]"
          >
            &nbsp;Terms & Conditions
          </Link>{" "}
          and{" "}
          <Link
            href="https://technupur.com"
            target="_blank"
            className="!text-[#0A84FF]"
          >
            Privacy Policy
          </Link>
          . Your data will be securely encrypted with TLS. 🔒
        </p>
      </div>
    </>
  );
};
export { CreateAccount };
