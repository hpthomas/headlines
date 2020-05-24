import sortHeadlines from './sortHeadlines';
import sortStories from './sortStories';
import {connect} from 'react-redux';

let proceess_stories = (story_results,success) => {
	if (!story_results) return;
	let keys = Object.keys(story_results);
	let stories = keys.map((key) => {
		let story= story_results[key];
		story.postID=key;
		if (story.headlines) {
			story.headlines = sortHeadlines(story.headlines);
		}
		else {
			story.headlines = [];
		}
		return story;
	});
	stories = sortStories(stories);	
	return stories;
}
export default process_stories;