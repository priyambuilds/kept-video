// Every film screen by design id, at its settled state (QA against the real app's screenshots, and the phone wall).
import React from "react";
import { TodayB1, RecapSheet } from "./today";
import { ConnectA2, LockM1, LookA4, SignScreen, SplashA0, VerifiedA3, WelcomeA1 } from "./onboarding";
import { GoalC1, InviteC8, LengthC3, ObjectC2, ReviewC5, StakeC4, SwornC7ok, TermsC6 } from "./oath";
import { CameraF1, CheckF2, DayKeptF5, PhotoDoneF3 } from "./proof";
import { ActiveD2, ClaimedJ1ok, KeptL1, OathsD0, RematchR1 } from "./stakes";
import { DetailH2, EndedH5, FeedH1, FundK2, JoinedH3 } from "./bounty";
import { ApprovedG3, InviteE2, JoinE2s, ReviewG1 } from "./social";
import { InboxN1, ProfileI1, RiyaI2, SwapW3, WalletW1 } from "./profile";

export const SCREENS: Record<string, () => React.ReactElement> = {
  M1: () => <LockM1 at={[0, 0, 0, 0, 0, 0]} />,
  A0: () => <SplashA0 />, A1: () => <WelcomeA1 />, A2: () => <ConnectA2 />,
  "A2·s": () => <SignScreen title="Sign in to KEPT" sub="Check your wallet to approve the message." steps={[1, 3]} />,
  A3: () => <VerifiedA3 />, A4: () => <LookA4 shuffles={[0, 100, 200]} />,
  B1: () => <TodayB1 />, B5: () => <TodayB1 still sheet={<RecapSheet at={0} />} />,
  C1: () => <GoalC1 typeAt={-2000} />, C2: () => <ObjectC2 pickAt={0} />, C3: () => <LengthC3 pickAt={0} />, C4: () => <StakeC4 />, C5: () => <ReviewC5 />, C6: () => <TermsC6 />,
  C7: () => <SignScreen title="Confirm in your wallet" sub="Staking 1,000 SKR into Iron Week." />,
  "C7·ok": () => <SwornC7ok />, C8: () => <InviteC8 joins={[0, 0, 0]} />,
  F1: () => <CameraF1 gesture="peace" />, F2: () => <CheckF2 gesture="peace" />, F2a: () => <CheckF2 gesture="peace" failAt={0} />, F3: () => <PhotoDoneF3 />, F4: () => <CameraF1 photo={2} />, F5: () => <DayKeptF5 />,
  D0: () => <OathsD0 />, D2: () => <ActiveD2 />, L1: () => <KeptL1 />, "J1·ok": () => <ClaimedJ1ok />, R1: () => <RematchR1 />,
  H1: () => <FeedH1 />, H2: () => <DetailH2 />, H3: () => <JoinedH3 />, H5: () => <EndedH5 />, K2: () => <FundK2 />,
  E2: () => <InviteE2 who="R" joined={["D", "A"]} />, "E2·s": () => <JoinE2s who="R" />, G1: () => <ReviewG1 />, G3: () => <ApprovedG3 />,
  I1: () => <ProfileI1 />, I2: () => <RiyaI2 />, W1: () => <WalletW1 />, N1: () => <InboxN1 />, W3: () => <SwapW3 />,
};
