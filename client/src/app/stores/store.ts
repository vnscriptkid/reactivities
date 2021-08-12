import { createContext, useContext } from "react";
import ActivityStore from "./activityStore";
import CommentStore from "./commentStore";
import CommonStore from "./commonStore";
import ModalStore from "./modalStore";
import ProfilesStore from "./profileStore";
import UserStore from "./userStore";

interface Store {
    activityStore: ActivityStore,
    userStore: UserStore,
    commonStore: CommonStore,
    modalStore: ModalStore,
    profileStore: ProfilesStore,
    commentStore: CommentStore
}

export const store: Store = {
    activityStore: new ActivityStore(),
    userStore: new UserStore(),
    commonStore: new CommonStore(),
    modalStore: new ModalStore(),
    profileStore: new ProfilesStore(),
    commentStore: new CommentStore()
}

export const StoreContext = createContext(store);

export function useStore() {
    return useContext(StoreContext);
}