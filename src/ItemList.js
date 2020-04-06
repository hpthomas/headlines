import uuid from 'uuid';
import React from 'react';
import Item from './Item';
//import {connect} from 'react-redux';

/* TODO:
  Right now creating Items with the props I will send once data is organzied how I want.
  First change here, then elsewhere
  News Item consists of:
  Original Title
  URL
  Best Rewriting
  Other Rewritings (2)
*/
const ItemList = (props) => {
  return (
    <div>
      <ul className = 'links'>
        {props.items.map(item =>
         <Item 
            key={uuid.v4()} 
            postID = {item.postID}
            category={item.category} 
            orTitle={item.title} 
            timestamp={item.timestamp}
            headlines={item.headlines}
            show={props.show?props.show:4}
            url={item.url} 
         />
        )}
      </ul>
    </div>
  );
  }
//NOTE: mstp removed, can restore
export default ItemList;