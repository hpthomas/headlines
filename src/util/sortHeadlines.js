let sortHeadlines = (submissions) => {
	//console.log(submissions);
	if (!submissions) return [];
	let headlines = Object.keys(submissions)
	.map(key=>{
		let headline = submissions[key]
		let reducer = function(score, cur) {
			if (cur) return score+1;
			else if (cur===false) return score-1;
			return score;
		}
		if (!headline.votes) headline.votes = [];	
		let score = Object.values(headline.votes).reduce(reducer,0);
		headline.score=score;
		headline.key=key;
		return headline;
	});
	headlines.sort( (a,b)=>b.score-a.score);
	return headlines;
}
export default sortHeadlines;
