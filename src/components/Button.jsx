import "../styles/button.css"

export default function Button({ text, color, textColor, onClick }){
    return(
        <>
            <button 
                className="main-button"
                style={{ backgroundColor: color, color: textColor }}
                onClick={ onClick }
            >
                { text }
            </button>
        </>
    )
}