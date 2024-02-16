import colors from "tailwindcss/colors";

import "../css/TalkBubble.css"

const TalkBubble = ({content, isVisible}) => {
    return <div className={`talkBubble ${isVisible ? "talkBubbleFadeIn" : "talkBubbleFadeOut" }`}>{content}</div>
}


export default TalkBubble;