/** 
 * 1. Render song
 * 2. Scroll top
 * 3. Play / pause / seek
 * 4. CD rotate
 * 5. Next / prev
 * 6. Random
 * 7. Next / repeat when ended
 * 8. Active song
 * 9. Scroll active song into view
 * 10. Play song when click
 * 11. reset cd rotation
 * 12. hiển thị thời gian chạy bài hát
 * 13. adjust the volume
 * 14. save the volume value to the config
 * 15. set the video background
 * 16. animation body background
 * 17. animation song title
 */

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY = 'F8-PLAYER'
const player = $('.player')
const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const playBtn = $('.btn-toggle-play')
const pauseBtn = $('.icon-pause')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const audio = $('#audio')
const volumeElem = $('.volume')
const volumeRange = $('#volume-range')
const progress = $('#progress')
const playList = $('.playlist')
const dashboard = $('.dashboard')
const currentTimeElem = $('.current-time')
const songTimeElem = $('.song-time')
const volumeIconElem = $('.volume-icon')
const option = $('.option')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    volume: 0,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    setConfig: function(key, value) {
        this.config[key] = value
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    songPlayed: [], 
    songs: [
        {
            name: 'Nevada',
            singer: 'Vicetone',
            path: './assets/music/Nevada.mp3',
            image: './assets/image/song1.jpg',
        },
        {
            name: 'Summer Time',
            singer: 'K-391',
            path: './assets/music/Summer Time.mp3',
            image: './assets/image/song2.jpg',
        },
        {
            name: 'Monody',
            singer: 'The Fat Rat',
            path: './assets/music/Monody.mp3',
            image: './assets/image/song3.jpg',
        },
        {
            name: 'Reality',
            singer: 'Lost Frequencies',
            path: './assets/music/Reality.mp3',
            image: './assets/image/song4.jpg',
        },
        {
            name: 'Ngày khác lạ',
            singer: 'Đen Ft Giang Phạm',
            path: './assets/music/Ngày Khác Lạ.mp3',
            image: './assets/image/song5.jpg',
        },
        {
            name: 'Nấu ăn cho em',
            singer: 'Đen',
            path: './assets/music/Nấu ăn cho em.mp3',
            image: './assets/image/song6.jpg',
        },
        {
            name: 'Mùa hè tuyệt vời',
            singer: 'Vicetone',
            path: './assets/music/Mùa hè tuyệt vời.mp3',
            image: './assets/image/song7.jpg',
        },
        {
            name: 'Mở mắt',
            singer: 'Đen',
            path: './assets/music/Mở mắt.mp3',
            image: './assets/image/song8.jpg',
        },
        {
            name: 'Rồi sẽ đến nơi',
            singer: 'Juun D',
            path: './assets/music/Rồi sẽ đến nơi.mp3',
            image: './assets/image/song9.jpg',
        },
        {
            name: 'Vì em chưa bao giờ khóc',
            singer: 'Hà Nhi',
            path: './assets/music/Vì em chưa bao giờ khóc.mp3',
            image: './assets/image/song10.jpg',
        },
        {
            name: 'Luôn yêu đời',
            singer: 'Đen',
            path: './assets/music/Luôn yêu đời.mp3',
            image: './assets/image/song11.jpg',
        },
    ],

    volumeIcon: [
        '<i class="fa-solid fa-volume-xmark"></i>',
        '<i class="fa-solid fa-volume-off"></i>',
        '<i class="fa-solid fa-volume-low"></i>',
        '<i class="fa-solid fa-volume-high"></i>'
    ],

    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${this.currentIndex === index ? 'active' : ''}" data-index="${index}">
                    <div class="thumb" style="background-image: url(${song.image})">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="music_icon fa-solid fa-ellipsis"></i>
                    </div>
                </div>
                `
        })
        playList.innerHTML = htmls.join('')
    },

    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get() {
                return this.songs[this.currentIndex]
            }
        })
    },

    handleEvents: function() {
        const _this = this

        // cd rotates and pausing depending on whether the song playing or paused
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ],
        {
            duration: 10000,
            iterations: Infinity,
        })
        cdThumbAnimate.pause()

        // the song title pass through and pausing depending on whether the song playing or paused
        const headerAnimate = heading.animate ([
            {
                transform: 'translateX(100%)',
                opacity: '0',
            },
            {
                transform: 'translateX(0)',
                opacity: '1',
            },
            {
                transform: 'translateX(-100%)',
                opacity: '0',
            },
        ],
        {
            duration: 10000,
            iterations: Infinity,
        })
        headerAnimate.cancel()


        // The action of scrolling the window zooms in or out the image of the cd
        const cdWidth = cd.offsetWidth
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth/cdWidth
        }

        // handle events when clicking play toggle button
        playBtn.onclick = () => {
            if (_this.isPlaying) {
                audio.pause()
        } else {
                audio.play()
            }
        }
        
        //  handle events when audio is playing
        audio.onplay = () => {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
            headerAnimate.play()
        }

        // handle events when audio is pausing
        audio.onpause = () => {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
            headerAnimate.cancel()
        }
        
        // handle events when the playing position of audio changes
        audio.ontimeupdate = () => {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
            // show the current time of the song that is playing
            let currentTime = Math.floor(audio.currentTime)
            // let currentMinutes = currentTime >= 60 ? `0${Math.floor(currentTime/60)}` : '00'
            let currentMinutes = Math.floor(currentTime/60)
            let currentSeconds = currentTime < 60 ? currentTime : currentTime - currentMinutes*60
            let currentTimePlaying = `0${currentMinutes}:${currentSeconds < 10 ? '0' + currentSeconds : currentSeconds}`
            currentTimeElem.innerHTML = currentTimePlaying
        }

        audio.oncanplay = () => {
            // show the total time of the song that is playing
            let songTime = Math.floor(audio.duration)
            let songMinutes = Math.floor(songTime / 60) 
            let songSeconds = songTime - songMinutes * 60
            songTimeElem.innerHTML = `0${songMinutes}:${songSeconds < 10 ? '0' + songSeconds : songSeconds}`
        }

        // handle events when dragging the slider
        progress.oninput = function () {
            const seek = this.value * audio.duration / 100
            audio.currentTime = seek
        }

        // adjust the volume slider
        volumeRange.oninput = function () {
            _this.volume = this.value / 100
            audio.volume = _this.volume
            // save the volume value to the config
            _this.setConfig('volume', _this.volume)
            let volumeIcon
            if (_this.volume === 0) {
                volumeIcon = _this.volumeIcon[0]
            } else if (_this.volume <= 0.3) {
                volumeIcon = _this.volumeIcon[1]
            } else if (_this.volume <= 0.7) {
                volumeIcon = _this.volumeIcon[2]
            } else {
                volumeIcon = _this.volumeIcon[3]
            }
            volumeIconElem.innerHTML = volumeIcon
        }
        
        // rotate the cd by js animation
        // let pos = 0
        // function rotate() {
        //     console.log('rotating')
        //     const myRotate = setInterval(myFunction, 10)
        //     function myFunction() {
        //         if (_this.isPlaying) {
        //             pos++
        //             cd.style.transform = `rotate(${pos}deg)`
        //         } else {
        //             clearInterval(myRotate)
        //             cd.style.transform = `rotate(${pos}deg)`
        //             console.log(pos)
        //         }
        //     }
        // }
        
        // handle events when clicking next button
        nextBtn.onclick = function() {
            // _this.addSongPlayed()
            cdThumbAnimate.cancel()
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextSong()
            }
            _this.render()
            console.log('song is playing:', _this.currentIndex)
            console.log('--------------------------------')
            // audio.play()
        }

        prevBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.prevSong()
            }
            _this.render()
            // audio.play()
        }

        // auto loading the next song when the current song is ended
        audio.onended = function() {
            // _this.addSongPlayed()
            if (_this.isRepeat) {
                audio.play()
            } else if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextSong()
            }
            _this.render()
            console.log('song is playing:', _this.currentIndex)
            console.log('--------------------------------')
        }

        // handle events when clicking random button
        randomBtn.onclick = function(e) {
            _this.isRandom = !_this.isRandom
            e.currentTarget.classList.toggle('active', _this.isRandom)
            _this.setConfig('isRandom', _this.isRandom)
            // khi click vào randomBtn thì repeatBtn sẽ bị xóa active và isRepeat = false
            // if (_this.isRepeat) {
            //     _this.isRepeat = !_this.isRepeat
            //     repeatBtn.classList.toggle('active', _this.isRepeat)
            // }
        }
        
        repeatBtn.onclick = function(e) {
            _this.isRepeat = !_this.isRepeat
            e.currentTarget.classList.toggle('active', _this.isRepeat)
            _this.setConfig('isRepeat', _this.isRepeat)
            // khi click vào repeatBtn thì randomBtn sẽ bị xóa active và isRandom = false
            // if (_this.isRandom) {
            //     _this.isRandom = !_this.isRandom
            //     randomBtn.classList.toggle('active', _this.isRandom)
            // }
        }

        // play song when click
        // const songList = $$('.song')
        // songList.forEach(function(song, index) {
        //     song.onclick = function() {
        //         _this.currentIndex = index
        //         _this.loadCurrentSong()
        //         audio.play()
        //     }
        // })
        playList.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')
            if (songNode &&
            !e.target.closest('.option')) {
                // e.target.closest('.song').classList.add('active')
                // console.log(songNode.dataset)
                _this.currentIndex = +songNode.dataset.index
                // console.log(_this.currentIndex)
                _this.render()
                _this.loadCurrentSong()
                audio.play()
            }
            if (e.target.closest('.option')) {
                alert('you clicked option')
            }
        }

        // show and hide the volume slider
        volumeIconElem.onclick = function(e) {
            volumeRange.classList.toggle('active')
            e.stopPropagation()
        }
        
        volumeRange.onclick = function(e) {
            e.stopPropagation()
        }

        document.onclick = function() {
            let result = 
            volumeRange.classList.remove('active')
        }
    },

    // Play / pause / seek
    loadCurrentSong: function() {
        heading.innerText = this.currentSong.name
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`
        audio.src = this.currentSong.path
        this.addSongPlayed()
        // this.ativeSong()
        this.scrollToActiveSong()
    },

    // define function load storage
    loadConfig: function() {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
        this.volume = this.config.volume
    },

    nextSong: function() {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
        audio.play()
    },

    prevSong: function() {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
        audio.play()
    },

    // add song to the array of songs was played
    addSongPlayed: function() {
        // console.log('song just played:', this.currentIndex)
        if (this.songPlayed.indexOf(this.currentIndex) === -1) {
            this.songPlayed.push(this.currentIndex)
        }
        if (this.songPlayed.length === this.songs.length) {
            this.songPlayed = []
        }
        console.log('songPlayed:', this.songPlayed)
    },

    playRandomSong: function() {
        let newIndex
        /** tạo ra số ngẫu nhiên newIndex sau đó kiểm tra newIndex có tồn tại trong
         * danh sách các bài hát đã phát hay không. nếu trùng thì quay lại bước tạo newIndex
         * nếu không trùng thì gán giá trị của newIndex cho biến this.currentIndex
        */
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
            console.log('newIndex:', newIndex)
            console.log('this song was played:', this.songPlayed.indexOf(newIndex) !== -1)
        }
        while (this.songPlayed.includes(newIndex))
        this.currentIndex = newIndex
        this.loadCurrentSong()
        audio.play()
    },

    // function active the song that is playing after rendering the songs list
    ativeSong: function() {
        // add class 'active' to the song is playing
        const songList = $$('.song')
        songList.forEach(function(song) {
            song.classList.remove('active')
        })
        songList[this.currentIndex].classList.add('active')

        /** tự động cuộn lên/cuộn xuống khi bài hát đang phát bị che khuất -> để thấy
         * được bài hát đang active
         */
        // if (songList[this.currentIndex].getBoundingClientRect().bottom > window.outerHeight) {
        //     const top = songList[this.currentIndex].offsetTop
        //     window.scrollTo({
        //         top: top,
        //         left: 0,
        //         behavior: "smooth",
        //     })
        // }
        // if (songList[this.currentIndex].getBoundingClientRect().top < dashboard.offsetHeight) {
        //     window.scrollTo({
        //         top: 0,
        //         left: 0,
        //         behavior: "smooth",
        //     })
        // }
    },

    scrollToActiveSong: function() {
        setTimeout(function() {
            songActive = $('.song.active')
            $('.song.active').scrollIntoView(
                {
                    behavior: 'smooth',
                    block: 'end',
                }
            )
        }, 300)
    },

    start: function() {
        // load the status of isRandom and isRepeat from the storage
        this.loadConfig()

        // Define properties for object app
        this.defineProperties()
        
        // Render playlist
        this.render()

        // Listen and handle events
        this.handleEvents()
        
        // load current song data to UI when playing
        this.loadCurrentSong()

        // show the status that is saved of the config values
        repeatBtn.classList.toggle('active', this.isRepeat)
        randomBtn.classList.toggle('active', this.isRandom)
        audio.volume = this.volume
        volumeRange.value = this.volume * 100
    }
}
app.start()

