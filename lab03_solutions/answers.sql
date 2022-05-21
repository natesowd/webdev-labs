-- Exercise 1:
SELECT * FROM users;

-- Exercise 2:
SELECT id, first_name, last_name 
FROM users;

-- Exercise 3:
SELECT id, first_name, last_name 
FROM users 
ORDER BY last_name;

-- Exercise 4: Posts by Nicholas Khan 
SELECT id, image_url, user_id 
FROM posts 
WHERE user_id = 26;

-- Exercise 5: Posts by Antonio Morgan or Samuel Williams
SELECT id, image_url, user_id 
FROM posts 
WHERE user_id = 26 or user_id = 12;

-- Exercise 6:
select count(*) from posts;

-- Exercise 7: Group By
SELECT user_id, count(*) 
FROM comments 
GROUP BY user_id 
ORDER BY count(*) desc;

-- Exercise 8: Join
SELECT posts.id, posts.image_url, posts.user_id, 
    users.username, users.first_name, users.last_name
FROM posts
INNER JOIN users ON
    posts.user_id = users.id
WHERE users.id = 12 or users.id = 26;

-- Exercise 9: Another Join
SELECT p.id, p.pub_date, f.following_id
FROM following f
INNER JOIN posts p ON
   f.following_id = p.user_id
WHERE f.user_id = 26;


-- Exercise 10: Another Join
SELECT p.id, p.pub_date, f.following_id, u.username
FROM following f
INNER JOIN posts p ON
   f.following_id = p.user_id
INNER JOIN users u ON
   f.following_id = u.id
WHERE f.user_id = 26
ORDER BY p.pub_date desc;

-- Exercise 11: Insert
INSERT INTO bookmarks(user_id, post_id, timestamp) VALUES(26, 219, now());
INSERT INTO bookmarks(user_id, post_id, timestamp) VALUES(26, 220, now());
INSERT INTO bookmarks(user_id, post_id, timestamp) VALUES(26, 221, now());

-- Exercise 12: Delete
DELETE FROM bookmarks WHERE user_id = 26 and post_id = 219;
DELETE FROM bookmarks WHERE user_id = 26 and post_id = 220;
DELETE FROM bookmarks WHERE user_id = 26 and post_id = 221;

-- Exercise 13: Update
UPDATE users SET email = 'knick2022@gmail.com' where id = 26;

-- Exercise 14: Another Join
SELECT p.id, p.user_id, count(c.id), concat(substring(p.caption, 0, 50), '...')
FROM posts p 
INNER JOIN comments c ON    
    p.id = c.post_id
WHERE p.user_id = 26
GROUP BY p.id, p.user_id, p.caption
ORDER BY count(c.id) desc;

