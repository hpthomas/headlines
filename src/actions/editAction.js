let editAction = (postID,title,url) => (
	{
		type: 'EDIT_ACTION', 
		postID: postID, 
		newTitle:title, 
		newURL:url
	}
);

export default editAction;