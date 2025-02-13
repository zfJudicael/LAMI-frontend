export function useNotificationSound(){
    var audio = new Audio('/src/assets/music/IPHONE NOTIFICATION SOUND EFFECT (PING_DING)(MP3_320K).mp3')
    audio.volume = 1
    audio.play()
}