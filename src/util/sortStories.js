let sortStories = (stories) => {
	stories.forEach(story=>{
		story.total = story.headlines.reduce( ((a,b) => a + b.score), 0)
		story.total += story.headlines.length;
	})
	stories.sort( (a,b) => b.total-a.total) ;
	return stories;
}
export default sortStories;