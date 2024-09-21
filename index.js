import { tweetsData  } from "./data.js";

const tweetInput = document.getElementById('tweet-input');
const tweetBtn = document.getElementById('tweet-btn');

tweetBtn.addEventListener('click', () => {
    console.log(tweetInput.value)
})

// We hook up an event listener to the 'document' itself because in this app we only have four buttons we can click, the 'tweet' button, and the icons for reply, like, and retweet.
// This way we keep the code 'DRY' and we don't hook up too many event listeners.
document.addEventListener('click', (e) => {
    if(e.target.dataset.like) {
        handleLikeClick(e.target.dataset.like)
    }
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
    })[0];

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

const getFeedHtml = () => {
    let feedHtml = ``;
    tweetsData.forEach(tweet => {
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
                                <i class="fa-solid fa-heart"
                                data-like="${tweet.uuid}"
                                ></i>
                                ${tweet.likes}
                            </span>
                            <span class="tweet-detail">
                                <i class="fa-solid fa-retweet"
                                data.retweet="${tweet.uuid}"
                                ></i>
                                ${tweet.retweets}
                            </span>
                        </div>   
                    </div>            
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