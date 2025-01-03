from app.database import db

# Channel Model
class Channel(db.Model):
    __tablename__ = 'channel'  # Đảm bảo bảng 'channel' tồn tại trong cơ sở dữ liệu
    channel_ID = db.Column(db.String(255), primary_key=True)
    channel_title = db.Column(db.Text)
    channel_description = db.Column(db.Text)
    channel_subscriberCount = db.Column(db.BigInteger)
    channel_viewCount = db.Column(db.BigInteger)
    channel_videoCount = db.Column(db.BigInteger)
    
    # Quan hệ: Một channel có nhiều video
    videos = db.relationship('Video', backref='channel', lazy=True)

    def __repr__(self):
        return f'<Channel {self.channel_title}>'

# Video Model
class Video(db.Model):
    __tablename__ = 'video'
    video_ID = db.Column(db.String(255), primary_key=True)
    channel_ID = db.Column(db.String(255), db.ForeignKey('channel.channel_ID'))
    channel_title = db.Column(db.Text)
    video_title = db.Column(db.Text)
    video_description = db.Column(db.Text)
    video_tags = db.Column(db.Text)
    video_viewCount = db.Column(db.BigInteger)
    video_likeCount = db.Column(db.BigInteger)
    video_commentCount = db.Column(db.BigInteger)
    video_dateModified = db.Column(db.Text)
    video_duration = db.Column(db.Text)
    category = db.Column(db.Text)
    like_view_ratio = db.Column(db.Float)
    comment_view_ratio = db.Column(db.Float)
    video_thumbnail = db.Column(db.Text)
    
    # Quan hệ: Một video có nhiều comment
    comments = db.relationship('Comment', backref='video', lazy=True)

    def __repr__(self):
        return f'<Video {self.video_title}>'

# Comment Model
class Comment(db.Model):
    __tablename__ = 'comment'
    comment_ID = db.Column(db.Text, primary_key=True)
    video_ID = db.Column(db.String(255), db.ForeignKey('video.video_ID'))
    comment_author = db.Column(db.Text)
    comment_text = db.Column(db.Text)
    comment_date = db.Column(db.Text)
    comment_likeCount = db.Column(db.BigInteger)
    sentiment_score = db.Column(db.Float)

    def __repr__(self):
        return f'<Comment {self.comment_author}: {self.comment_text[:30]}...>'