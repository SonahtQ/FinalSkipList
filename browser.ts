import FinalSkipList from "./src/FinalSkipList";

declare global {
    interface Window { FinalSkipList: typeof FinalSkipList; }
}

window.FinalSkipList = FinalSkipList;