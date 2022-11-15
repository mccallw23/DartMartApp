import React from 'react';
import { connect } from 'react-redux';

import { increment, decrement } from '../actions';

// 3. `props.increment/decrement`
// Here’s the confusing part. You must call the connected version of the actionCreator methods in props
// rather than calling them directly. If you just call the methods directly nothing will happen
// (as Redux doesn’t know about them. However the versions of the versions that are passed into `props` will get
// passed down into the reducer. ⚠️⚠️ This is important - you have 2 versions of each of the ActionCreator functions
// in your namespace — one in props and one not. The props version is one you want to use,
// if nothing happens, that means most likely you are calling the non-connected non-props version.
function Controls(props) {
  return (
    <View>
      <button type="button" onClick={props.increment}>+</button>
      <button type="button" onClick={props.decrement}>-</button>
    </View>
  );
}

// note how here we leave the first argument null, we don't need to connect any state just actions
export default connect(null, { increment, decrement })(Controls);
