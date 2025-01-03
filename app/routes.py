from flask import Flask, render_template, request, jsonify, send_file
from app.config import Config
from app.database import init_db
from app.models import Channel, Video, Comment, db
from app.services import extract_keywords_tfidf
import csv
from io import StringIO

from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])

app.config.from_object(Config)

# Initialize the database
init_db(app)
# Create URL to video
def create_youtube_url(video_id: str) -> str:
    return f'https://www.youtube.com/watch?v={video_id}'

# Route to the main page (category selection)
@app.route('/')
def main_page():
    categories = db.session.query(Video.category).distinct().all()
    categories = [category for category in categories]
    return render_template('mainpage.html', categories=categories)

@app.route('/api/dashboard/<category>', methods=['GET'])
def api_dashboard(category):
    videos = Video.query.filter_by(category=category).all()
    total_videos = len(videos)
    
    # Aggregate data for the selected category
    average_views = db.session.query(db.func.avg(Video.video_viewCount)).filter_by(category=category).scalar()
    average_likes = db.session.query(db.func.avg(Video.video_likeCount)).filter_by(category=category).scalar()
    average_comments = db.session.query(db.func.avg(Video.video_commentCount)).filter_by(category=category).scalar()

    # Prepare the data for the response
    videos_data = [{
        'id': video.video_ID,
        'name': video.video_title,
        'Date_modified': video.video_dateModified,
        'duration': video.video_duration,
        'view': video.video_viewCount,
        'like': video.video_likeCount,
        'comment': video.video_commentCount
    } for video in videos]
    response = {
        'topic': category,
        'TotalVideo': total_videos,
        'AveView': average_views,
        'AveLike': average_likes,
        'AveComment': average_comments,
        'table': videos_data
    }
    return jsonify(response)

# Route to channel details page
@app.route('/api/channel_details/<channel_id>', methods=['GET'])
def api_channel_details(channel_id):
    channel = Channel.query.filter_by(channel_ID=channel_id).first()
    if not channel:
        return jsonify({"error": "Channel not found"}), 404
    videos = Video.query.filter_by(channel_ID=channel_id).all()
    total_likes = sum([video.video_likeCount for video in videos])
    total_comments = sum([video.video_commentCount for video in videos])
    videos_data = [{
        'id': video.video_ID,
        'name': video.video_title,
        'Date_modified': video.video_dateModified,
        'duration': video.video_duration,
        'view': video.video_viewCount,
        'like': video.video_likeCount,
        'comment': video.video_commentCount
    } for video in videos]
    response = {
        'id': channel.channel_ID,
        'title': channel.channel_title,
        'description': channel.channel_description,
        'subscriber': channel.channel_subscriberCount,
        'view': channel.channel_viewCount,
        'video': channel.channel_videoCount,
        'like': total_likes,
        'comment': total_comments,
        'videos': videos_data
    }
    return jsonify(response)

# Route to video details page
@app.route('/api/video_details/<video_id>', methods=['GET'])
def api_video_details(video_id):
    video = Video.query.filter_by(video_ID=video_id).first()
    if not video:
        return jsonify({"error": "Video not found"}), 404 
    channels = Channel.query.filter_by(channel_ID=video.channel_ID).first()
    if not channels:
        return jsonify({"error": "Channel not found for this video"}), 404 
    video_url = create_youtube_url(video.video_ID)
    channel_data = {
        'id': channels.channel_ID,
        'title': channels.channel_title,
        'description': channels.channel_description,
        'subscriber': channels.channel_subscriberCount,
        'view': channels.channel_viewCount,
        'video': channels.channel_videoCount
    }
    response = {
        'id': video.video_ID,
        'title': video.video_title,
        'description': video.video_description,
        'tags': video.video_tags,
        'view': video.video_viewCount,
        'like': video.video_likeCount,
        'comment': video.video_commentCount,
        'date_modified': video.video_dateModified,
        'duration': video.video_duration,
        'category': video.category,
        'like_view_ratio': video.like_view_ratio,
        'comment_view_ratio': video.comment_view_ratio,
        'thumbnail': video.video_thumbnail,
        'video_url': video_url,
        'channel': channel_data
    }
    return jsonify(response)

# Route to comment details page
@app.route('/api/comment_details/<video_id>', methods=['GET'])
def api_comment_details(video_id):
    comments = Comment.query.filter_by(video_ID=video_id).all()
    if not comments:
        return jsonify({"error": "No comments found for this video"}), 404
    video = Video.query.filter_by(video_ID=video_id).first()
    if not video:
        return jsonify({"error": "Video not found"}), 404
    avg_sentiment_score = db.session.query(db.func.avg(Comment.sentiment_score)).filter_by(video_ID=video_id).scalar()
    wordcloud = extract_keywords_tfidf([comment.comment_text for comment in comments])
    response = []
    for comment in comments:
        response.append({
            'id': comment.comment_ID,
            'author': comment.comment_author,
            'text': comment.comment_text,
            'date': comment.comment_date,
            'like': comment.comment_likeCount,
            'sentiment_score': comment.sentiment_score,
            'avg_sentiment_score': avg_sentiment_score,
            'wordcloud': wordcloud,
            'video_id': video.video_ID,
            'video_title': video.video_title,
        })
    return jsonify(response)

# Route to compare channel page
@app.route('/api/compare_channel', methods=['POST'])
def api_compare_channel():
    data = request.get_json()
    channel_title = data.get('channel_title')
    
    if not channel_title:
        return jsonify({"error": "channel_title is required"}), 400
    
    channel = Channel.query.filter(Channel.channel_title.ilike(f"%{channel_title}%")).first()
    
    if not channel:
        return jsonify({"error": "No channels found with the provided title"}), 404
    
    response = []
    avg_views = db.session.query(db.func.avg(Video.video_viewCount)).filter_by(channel_ID=channel.channel_ID).scalar()
    avg_likes = db.session.query(db.func.avg(Video.video_likeCount)).filter_by(channel_ID=channel.channel_ID).scalar()
    avg_comments = db.session.query(db.func.avg(Video.video_commentCount)).filter_by(channel_ID=channel.channel_ID).scalar()

    # Round the values to 1 decimal place
    avg_views = round(avg_views, 1) if avg_views is not None else 0
    avg_likes = round(avg_likes, 1) if avg_likes is not None else 0
    avg_comments = round(avg_comments, 1) if avg_comments is not None else 0

    response.append({
        'id': channel.channel_ID,
        'title': channel.channel_title,
        'subscriber': channel.channel_subscriberCount,
        'video': channel.channel_videoCount,
        'view': avg_views,
        'like': avg_likes,
        'comment': avg_comments,
    })

    return jsonify(response)


@app.route('/api/export_data', methods=['POST'])
def export_data():
    data = request.get_json()
    export_type = data.get('type')
    selected_attributes = data.get('attributes', [])  

    if export_type == 'channel':
        channel_id = data.get('channelID')
        if not channel_id:
            return jsonify({"error": "Channel ID is required"}), 400
        channel = Channel.query.filter_by(channel_ID=channel_id).first()
        video = Video.query.filter_by(channel_ID=channel_id).all()
        total_likes = sum([video.video_likeCount for video in video])
        total_comments = sum([video.video_commentCount for video in video])
        if not channel:
            return jsonify({"error": "Channel not found"}), 404
        videos = [{
            'title': video.video_title,
            'date_modified': video.video_dateModified,
            'view': video.video_viewCount,
            'like': video.video_likeCount,
            'comment': video.video_commentCount
        } for video in video]
        attributes = {
            'id': channel.channel_ID,
            'title': channel.channel_title,
            'description': channel.channel_description,
            'subscriber': channel.channel_subscriberCount,
            'view': channel.channel_viewCount,
            'video': channel.channel_videoCount,
            'like': total_likes,
            'comment': total_comments,
            'video_list': videos
        }
        response = {attr: attributes.get(attr, None) for attr in selected_attributes}
        return jsonify(response)

    elif export_type == 'video':
        video_id = data.get('videoID')
        if not video_id:
            return jsonify({"error": "Video ID is required"}), 400
        video = Video.query.filter_by(video_ID=video_id).first()
        comment = Comment.query.filter_by(video_ID=video_id).all()
        video_url = create_youtube_url(video.video_ID)
        if not video:
            return jsonify({"error": "Video not found"}), 404
        comments = [{  
            'author': comment.comment_author,
            'text': comment.comment_text,
            'date': comment.comment_date,
            'like': comment.comment_likeCount,
            'sentiment_score': comment.sentiment_score
        } for comment in comment]
        attributes = {
            'id': video.video_ID,
            'title': video.video_title,
            'description': video.video_description,
            'tags': video.video_tags,
            'view': video.video_viewCount,
            'like': video.video_likeCount,
            'comment': video.video_commentCount,
            'date_modified': video.video_dateModified,
            'duration': video.video_duration,
            'category': video.category,
            'like_view_ratio': video.like_view_ratio,
            'comment_view_ratio': video.comment_view_ratio,
            'video_url': video_url,
            'comment_list': comments
        }
        response = {attr: attributes.get(attr, None) for attr in selected_attributes}
        return jsonify(response)
    return jsonify({"error": "Invalid export type"}), 400

if __name__ == "__main__":
    app.run(debug=True)
