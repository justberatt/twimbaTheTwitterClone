import { tweetsData  } from "./data.js";
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

// tweetBtn.addEventListener('click', () => {
//     console.log(tweetInput.value)
// })

// We hook up an event listener to the 'document' itself because in this app we only have four buttons we can click, the 'tweet' button, and the icons for reply, like, and retweet.
// This way we keep the code 'DRY' and we don't hook up too many event listeners.
document.addEventListener('click', (e) => {
    if (e.target.dataset.like)
        handleLikeClick(e.target.dataset.like)
    else if (e.target.dataset.retweet)
        handleRetweetClick(e.target.dataset.retweet)
    else if(e.target.dataset.reply)
        handleReplyClick(e.target.dataset.reply)
    else if(e.target.id === 'tweet-btn')
        handleTweetBtnClick()
})

const handleLikeClick = (tweetId) => {
    // My first more direct approach
    /*tweetsData.forEach(tweet => {
        if (tweet.uuid === tweetId) {
            const targetTweetObj = tweet;
            if (targetTweetObj.isLiked === false) {
                targetTweetObj.likes++;
                targetTweetObj.isLiked = true;
                
            } else {
                targetTweetObj.likes--;
                targetTweetObj.isLiked = false;
            }
            render();
                     
        }
    })*/
   
    // A more readable approach (although not neccessarily more efficient)
    const targetTweetObj = tweetsData.filter(tweet => {
        return tweet.uuid === tweetId // Returns either true or false
    })[0]; // We take the first object of the array returned because here we know for sure that only one object will pass the test since UUIDs are unique identifiers

    if (targetTweetObj.isLiked)
        targetTweetObj.likes--;
    else
        targetTweetObj.likes++;
    targetTweetObj.isLiked = !targetTweetObj.isLiked;
    render(); /* The reason we use "render()" is so that the UI gets rerendered and this will update the value of the likes (i.e. +1)
                 This happens because when we are saving the tweet inside of targetTweetObj, we are not creating a new 'tweet' object,
                 we are just referencing that object, so then when we increment the number of likes, i.e. "targetTweetObj.likes++",
                 we are actually changing the original object in the original "tweetData array", so when we call the render() here, 
                 it will display the new value of likes.
                 */
}

const handleRetweetClick = (tweetId) => {
    const targetTweetObj = tweetsData.filter(tweet => {
        return tweet.uuid === tweetId
    })[0]
    if (targetTweetObj.isRetweeted)
        targetTweetObj.retweets--
    else
        targetTweetObj.retweets++
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render()
}

const handleReplyClick = (replyID) => {
    document.getElementById(`replies-${replyID}`).classList.toggle('hidden')
}

const handleTweetBtnClick = () => {
    const tweetInput = document.getElementById('tweet-input');
    if (tweetInput.value) {
        tweetsData.unshift(
            {
                handle: `@Scrimba`,
                profilePic: `images/scrimbalogo.png`,
                likes: 0,
                retweets: 0,
                tweetText: tweetInput.value,
                replies: [],
                isLiked: false,
                isRetweeted: false,
                uuid: uuidv4(), 
            }
        )
        render()
        tweetInput.value = ''
    }
}

const getFeedHtml = () => {
    let feedHtml = ``;
    tweetsData.forEach(tweet => {
        let likeIconClass = '' // This is the class that will be added inside the HTML classlist of the heart icon
        let retweetIconClass = '' //    - || - || - ||  - || - || - ||  - || - || - ||  - || - of the retweed icon

        if(tweet.isLiked)
            likeIconClass = 'liked' // We have this class styled in the CSS. This part of the code runs or doesn't depending on the handleLikeClick() function

        if(tweet.isRetweeted)
            retweetIconClass = 'retweeted' // We have this class styled in the CSS. This part of the code runs or doesn't depending on the handleRetweetClick() function

        let repliesHtml = '';
        if (tweet.replies.length > 0) {
            tweet.replies.forEach(reply => {
                repliesHtml += `
                <div class="tweet-reply">
                    <div class="tweet-inner">
                        <img src="${reply.profilePic}" class="profile-pic">
                            <div>
                                <p class="handle">${reply.handle}</p>
                                <p class="tweet-text">${reply.tweetText}</p>
                            </div>
                    </div>
                </div>
                `
            })
        }

        feedHtml += `
            <div class="tweet">
                <div class="tweet-inner">
                    <img src="${tweet.profilePic}" class="profile-pic">
                    <div>
                        <p class="handle">${tweet.handle}</p>
                        <p class="tweet-text">${tweet.tweetText}</p>
                        <div class="tweet-details">
                            <span class="tweet-detail">
                                <i class="fa-regular fa-comment-dots"
                                ${/* We use the 'data' attribute because we need to connect the icons to the id of the parent element holding the tweet and the icons.
                                    So we need the data attributes so that we know which tweet does the icon belong to when we click it.
                                    Normally to do that, we would to give the id of the parent to each of the icons, but that is impossible because ids are unique.
                                    But we can achieve that same result by giving the icons a data attribute. And of course data attributes take names, so in this case we have 
                                    given them the names: reply (i.e. data-reply), like (i.e. data-like), and retweet (i.e. data-retweet) 
                                    So now since all the tweets in the data.js file have a unique uuid, we can connect the tweet to teh icons through that uuid, and we use the e.target.dataset to
                                    access the information on as to which one of the icons was clicked on which one of the tweets, therefore updating that one in the UI.*/ ''}
                                data-reply="${tweet.uuid}"
                                ></i>
                                ${tweet.replies.length}
                            </span>
                            <span class="tweet-detail">
                                <i class="fa-solid fa-heart ${likeIconClass}"
                                data-like="${tweet.uuid}"
                                ></i>
                                ${tweet.likes}
                            </span>
                            <span class="tweet-detail">
                                <i class="fa-solid fa-retweet ${retweetIconClass}"
                                data-retweet="${tweet.uuid}"
                                ></i>
                                ${tweet.retweets}
                            </span>
                        </div>   
                    </div>            
                </div>
                <div class="hidden" id="replies-${tweet.uuid}">
                    ${repliesHtml}
                </div>
            </div>
        `
    })
    return (feedHtml)
}

const render = () => {
    document.getElementById('feed').innerHTML = getFeedHtml();
}

render()