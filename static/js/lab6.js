//Suggestions Aside

const toggleFollow = ev => {
    const elem = ev.currentTarget;
    if (elem.innerHTML === 'follow'){
        followUser(elem.dataset.userId, elem)
        //elem.innerHTML = 'unfollow'
        //elem.classList.add('unfollow');
        //elem.classList.remove('follow');
    } else {
        unfollowUser(elem.dataset.followingId, elem);
        //elem.innerHTML = 'follow'
        //elem.classList.add('follow');
        //elem.classList.remove('unfollow');

    }
};

const followUser = (userId, elem) => {
    const postData = {
        "user_id": userId
    };
    
    fetch("/api/following/", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            elem.innerHTML = 'unfollow'

            elem.setAttribute('aria-checked', 'true');

            elem.classList.add('unfollow');
            elem.classList.remove('follow');
            elem.setAttribute('data-following-id', data.id);
        });
};

const  unfollowUser = (followingId, elem) => {
    const deleteURL = `/api/following/${followingId}`;
    fetch(deleteURL, {
        method: "DELETE",
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        elem.innerHTML = 'follow'
        elem.classList.add('follow');
        elem.classList.remove('unfollow');
        elem.removeAttribute('data-following-id');
        elem.setAttribute('aria-checked', 'false');
    });


};


const user2Html = user => {
   return `<section class="Rec_Cards">
            <div class="rec_img"><img src="${user.thumb_url} alt=""></div>
            <div class="rec_text">
                <p class="user">${user.username}</p> 
                <p class="sugg">suggested for you</p>
            </div>
            <button 
            aria-label="Follow"
            aria-checked="false"
            data-user-id="${user.id}" 
            onclick="toggleFollow(event);">follow</button>
    
    </section>`;

};


const getSuggestions = () => {
    fetch('/api/suggestions')
        .then(response => response.json())
        .then(users => {
            console.log(users);
            const html = users.map(user2Html).join('\n');
            document.querySelector('.suggestions').innerHTML = html;
        });
};


getSuggestions();

//Suggestions Profile Display

const profile2Html = (profile) => {
    return `
    <section class="User_Card">
        <div class="user_img"><img src=${ profile.image_url } alt="${ profile.username }"></div>
        <p>${ profile.username }</p>
    </section>
    `;
};

const displayProfile = () => {
    fetch('/api/profile')
        .then(response => response.json())
        .then(profile => {
            //const html = profile.map(profile2Html).join('\n');
            const html = profile2Html(profile);
            document.querySelector('.profile').innerHTML = html;
        })
};


//Stories Display

const story2Html = story => {
    return `
        <section class="story_card">
            <div class="story_img"><img src="${ story.user.thumb_url }" alt="profile pic for ${ story.user.username }"></div>
            <p class="story_user">${ story.user.username }</p>
        </section>
    `;
};

// fetch data from your API endpoint:
const displayStories = () => {
    fetch('/api/stories')
        .then(response => response.json())
        .then(stories => {
            const html = stories.map(story2Html).join('\n');
            document.querySelector('.stories').innerHTML = html;
        })
};

//const initPage = () => {
//    displayStories();
//    displayProfile();
 //   displayPosts();
//};

// invoke init page to display stories:
//initPage();





// Comment Stuff

//Handle Change event listener

const addComment = ev => {
    const postId = ev.currentTarget.dataset.postId;
    console.log(postId)
    const input = document.querySelector('#input_' + postId).value
    console.log(input)
    const postData = {
        "post_id": postId,
        "text": input
    };
    
    fetch('api/comments', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            redrawPost(postId);
        });
};

const comment2Html = post => {
    
    if(post.comments.length > 1) {
        return `
        <button class="view_more" data-post-id=${post.id} onclick="showModal(event)">View all ${ post.comments.length } comments</button>
        <p class="comment"><b>${ post.comments[post.comments.length - 1].user.username }</b>
        ${ post.comments[post.comments.length - 1].text }
        </p>
        <p> ${post.comments[post.comments.length - 1].display_time} </p>
    `
    } else if(post.comments.length == 0){
       return ``
    } else{
        return `
        <p class="comment"><b>${ post.comments[0].user.username }</b>
        ${ post.comments[0].text }
        </p>
        <p> ${post.comments[0].display_time} </p>
        `
    }

};

//Modal Stuff

const showModal = ev => {
    const postId = Number(ev.currentTarget.dataset.postId);
    redrawPost(postId, post => {
        console.log(post)
        const html = post2Modal(post);
        document.querySelector(`#post_${post.id}`).insertAdjacentHTML('beforeend', html)
    });
}

const post2Modal = post => {
    return `
    <div class="modal-bg" aria-hidden="false" role="dialog">
            <section class="modal">
                <button class="close" aria-label="Close the modal window" onclick="closeModal(event);">Close</button>
                <img src=${ post.image_url } alt=${ post.alt_text }>
                <div class="modal-body">
                   ${getAllCommentsHtml(post.comments)}   
                </div>
            </section>
        </div>
        `;
};


const getAllCommentsHtml = comments => {
    return comments.map(comment => {
        return `
        <div class="row">
        <p> <b> ${ comment.user.username } </b>
          ${comment.text}</p>
        </div>`
    }).join('')
}

const closeModal = ev => {
    console.log("close modal")
    document.querySelector('.modal-bg').remove();
};

//Posts Stuff

const post2Html = post => {
    return `
    <section id="post_${post.id}" class="post_card">
        <div class="post_top">
            <p class="poster">${ post.user.username }</p>
            <i class="fa-solid fa-ellipsis"></i>
        </div>
        <div class="post_img"><img src=${ post.image_url } alt=${ post.alt_text }></div>
        <div class="post_content">
            <div class="my_symbols">
                ${ renderLikeButton(post) }
                    <button> <i class="fa-regular fa-paper-plane"></i> </button>
                    ${ renderBookButton(post) }
            
                
            </div>
            <p class="likes"><b>${ post.likes | post.likes.length } likes</b></p>
            <p>${ post.display_time }</p>
            <p class="caption"><b>${ post.user.username }</b>
            ${ post.caption }
                <button>more</button>
            </p>

            ${comment2Html(post)}

            <div class="add_comment">
            <p class="comment_box">
                <input id="input_${post.id}" type="text" placeholder="&#x263A;  Add a Comment...">
                
            </p>
            <button onclick="addComment(event);" data-post-id="${post.id}" >Post</button>
            </div>
        </div>
    </section>
    `;
};

const displayPosts = () => {
    fetch('/api/posts')
        .then(response => response.json())
        .then(posts => {
            console.log(posts)
            const html = posts.map(post2Html).join('\n');
            document.querySelector('.post').innerHTML = html;
        })
        
};



// Like Stuff

const renderLikeButton = post => {
    if (post.current_user_like_id){
        return `
            <button
                aria-label="like / unlike"
                aria-checked="true"
                data-post-id="${post.id}"
                data-like-id="${post.current_user_like_id}"
                onclick="toggleLike(event);" 
                class="interact_symbols"><i class="fas fa-heart"></i>
            </button>`
    } else {
        return `
            <button
                aria-label="like / unlike"
                aria-checked="false"
                data-post-id="${post.id}"
                onclick="toggleLike(event);" 
                class="interact_symbols"><i class="far fa-heart"></i>
            </button>`

    }
};

const toggleLike = ev => {
    const elem = ev.currentTarget;
    console.log(elem)
    if (elem.getAttribute('aria-checked') === 'true' ){
        console.log('unlike post')
        unlikePost(elem);
        //elem.innerHTML = 'unfollow'
        //elem.classList.add('unfollow');
        //elem.classList.remove('follow');
    } else {
        console.log('like post')
        likePost(elem);
        //elem.innerHTML = 'follow'
        //elem.classList.add('follow');
        //elem.classList.remove('unfollow');

    }
};

const innerPost2Html = post => {
    return `
        <div class="post_top">
            <p class="poster">${ post.user.username }</p>
            <i class="fa-solid fa-ellipsis"></i>
        </div>
        <div class="post_img"><img src=${ post.image_url } alt=${ post.alt_text }></div>
        <div class="post_content">
            <div class="my_symbols">
                ${ renderLikeButton(post) }
                    <button> <i class="fa-regular fa-paper-plane"></i> </button>
                    ${ renderBookButton(post) }
            
                
            </div>
            <p class="likes"><b>${ post.likes | post.likes.length } likes</b></p>
            <p>${ post.display_time }</p>
            <p class="caption"><b>${ post.user.username }</b>
            ${ post.caption }
                <button>more</button>
            </p>

            ${comment2Html(post)}

            <div class="add_comment">
            <p class="comment_box">
                <input id="input_${post.id}" type="text" placeholder="&#x263A;  Add a Comment...">
                
            </p>
            <button onclick="addComment(event);" data-post-id="${post.id}">Post</button>
            </div>
        </div>
    `;
};

const redrawPost = (postId, callBack) => {
    fetch(`api/posts/${postId}`)
        .then(response => response.json())
        .then(updatedPost => {
            if(!callBack){
                redrawCard(updatedPost, postId);
            } else {
                callBack(updatedPost)
            }
            //console.log(updatedPost);
            //const html = innerPost2Html(updatedPost[0]);
            //const postElement = document.querySelector(`#post_${postId}`)
            //postElement.innerHTML = html;
    
        });

};

const redrawCard = (post, postId) => {
    console.log(post);
    const html = innerPost2Html(post[0]);
    const postElement = document.querySelector(`#post_${postId}`);
    postElement.innerHTML = html;
};

const likePost = elem =>{
    const postId = Number(elem.dataset.postId);
    const postData = {
        "post_id": postId
    };
    fetch("api/posts/likes", {
        method: "POST",
        headers: {
            'Content-Type':'application/json',
        },
        body:JSON.stringify(postData)})
        .then(response => response.json())
        .then(data => {
            redrawPost(postId);
            //elem.innerHTML = '<button aria-label="like" aria-checked="false" data-post-id="${post.id}" onclick="toggleLike(event);" class="interact_symbols"><i class="fa-solid fa-heart"></i></button>';
            //elem.classList.add('liked');
            //elem.setAttribute('aria-checked', 'true')
            //elem.setAttribute('data-like-id', data.id)
            //elem.classList.remove('unliked')
        })
};

const unlikePost = elem =>{
    const postId = Number(elem.dataset.postId);
    fetch(`api/posts/likes/${elem.dataset.likeId}`,{
        method: "DELETE",
        headers: {
            'Content-Type':'application/json',
        }
    })
        
        .then(response => response.json())
        .then(data => {
            redrawPost(postId);
                //elem.innerHTML = '<button aria-label="like" aria-checked="false" data-post-id="${post.id}" onclick="toggleLike(event);" class="interact_symbols"><i class="fa-solid fa-heart"></i></button>';
                //elem.classList.add('liked');
                //elem.setAttribute('aria-checked', 'true')
                //elem.setAttribute('data-like-id', data.id)
                //elem.classList.remove('unliked')
        })
};


//Bookmark Stuff

const renderBookButton = post => {
    if (post.current_user_bookmark_id){
        return `
            <button
                aria-label="bookmark / unbookmark"
                aria-checked="true"
                data-post-id="${post.id}"
                data-bookmark-id="${post.current_user_bookmark_id}"
                onclick="toggleMark(event);" 
                class="bookmark"><i class="fas fa-bookmark"></i>
            </button>`
    } else {
        return `
            <button
                aria-label="bookmark / unbookmark"
                aria-checked="false"
                data-post-id="${post.id}"
                onclick="toggleMark(event);" 
                class="bookmark"><i class="far fa-bookmark"></i>
            </button>`

    }
};

const toggleMark = ev => {
    const elem = ev.currentTarget;
    if (elem.getAttribute('aria-checked') === 'true' ){
        console.log('unbookmark post')
        unlikeMark(elem)
    } else {
        console.log('bookmark post')
        likeMark(elem);
    }
}

const likeMark = elem =>{
    const postId = Number(elem.dataset.postId);
    const postData = {
        "post_id": postId
    };
    fetch("api/bookmarks/", {
        method: "POST",
        headers: {
            'Content-Type':'application/json',
        },
        body:JSON.stringify(postData)})
        .then(response => response.json())
        .then(data => {
            redrawPost(postId);
            //elem.innerHTML = '<button aria-label="like" aria-checked="false" data-post-id="${post.id}" onclick="toggleLike(event);" class="interact_symbols"><i class="fa-solid fa-heart"></i></button>';
            //elem.classList.add('liked');
            //elem.setAttribute('aria-checked', 'true')
            //elem.setAttribute('data-like-id', data.id)
            //elem.classList.remove('unliked')
        })
};

const unlikeMark = elem =>{
    const postId = Number(elem.dataset.postId);
    console.log('unbookmark post', elem)
    console.log(elem.dataset.bookmarkId)
    fetch(`api/bookmarks/${elem.dataset.bookmarkId}`,{
        method: "DELETE",
        headers: {
            'Content-Type':'application/json',
        }
    })
        .then(response => response.json())
        .then(data => {
            redrawPost(postId);
                //elem.innerHTML = '<button aria-label="like" aria-checked="false" data-post-id="${post.id}" onclick="toggleLike(event);" class="interact_symbols"><i class="fa-solid fa-heart"></i></button>';
                //elem.classList.add('liked');
                //elem.setAttribute('aria-checked', 'true')
                //elem.setAttribute('data-like-id', data.id)
                //elem.classList.remove('unliked')
        })
};




// Initialization

const initPage = () => {
    //displayPosts();
    displayStories();
    displayProfile();
    displayPosts();
};
initPage();

