import base64
from io import BytesIO
from wordcloud import WordCloud
import string
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer

def preprocess(text):
    return ''.join([char.lower() if char not in string.punctuation else ' ' for char in text])

def extract_keywords_tfidf(comments):
    processed_comments = [preprocess(comment) for comment in comments]

    vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = vectorizer.fit_transform(processed_comments)

    feature_names = np.array(vectorizer.get_feature_names_out())
    tfidf_scores = np.array(tfidf_matrix.sum(axis=0)).flatten()

    words_with_scores = dict(zip(feature_names, tfidf_scores))

    top_n_keywords = sorted(words_with_scores.items(), key=lambda x: x[1], reverse=True)[:10]

    keywords = ' '.join([word for word, score in top_n_keywords])

    wordcloud = WordCloud(width=800, height=400, background_color='white').generate(keywords)

    img_buffer = BytesIO()
    wordcloud.to_image().save(img_buffer, format='PNG')
    img_base64 = base64.b64encode(img_buffer.getvalue()).decode('utf-8')

    return img_base64
