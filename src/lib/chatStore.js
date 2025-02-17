import { create } from 'zustand'
import { doc, getDoc } from "firebase/firestore";
import { db } from './firebase';
import { useUserStore } from './userStore';

export const useChatStore = create((set) => ({
  chatId: null,
  user:null,
  isCurrentUserBlocked: false,
  isReceiverBlocked:false, 
  changeChat: (chatId, user)=>{
    const currentUser = useUserStore.getState().currentUser
    
    if (!currentUser || !user) {
        console.error("User or currentUser is undefined");
        return;
      }
     // Check if 'blocked' exists and is an array before calling .includes()
     if (Array.isArray(user.blocked) && user.blocked.includes(currentUser.id)) {
        return set({
          chatId,
          user: null,
          isCurrentUserBlocked: true,
          isReceiverBlocked: false, 
        });
      } else if (Array.isArray(currentUser.blocked) && currentUser.blocked.includes(user.id)) {
        return set({
          chatId,
          user: user,
          isCurrentUserBlocked: false,
          isReceiverBlocked: true, 
        });
    //check if the receiver is blocked

} else {
    return set({
      chatId,
      user: user,
      isCurrentUserBlocked: false,
      isReceiverBlocked: false, 
    });
  }
    changeBlock: ()=>{
        set(state=>({...state,isReceiverBlocked: !state.isReceiverBlocked}))
    }
  }
}))