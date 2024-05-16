import React, { Component } from 'react';
import ChatBot from 'react-simple-chatbot';
import Post from './Post';


class SimpleForm extends Component {
  render() {
    return (
      <ChatBot 
        steps={[
          {
            id:'inputgender', 
            message:'What is your gender?', 
            trigger:'gender',
          },
          {
            id:'gender', 
            user:true,
            trigger:'inputpal'
          },
          {
            id:'inputpal', 
            message:'What is your pal?', 
            trigger:'pal',
          },
          {
            id:'pal', 
            user:true,
            trigger:'inputweight'
          },
          {
            id:'inputweight', 
            message:'Finally. what is you weight?', 
            trigger:'weight',
          },
          {
            id:'weight', 
            user:true,
            trigger:'inputheight'
          },
          {
            id:'inputheight', 
            message:'Finally. what is you height?', 
            trigger:'height',
          },
          {
            id:'height', 
            user:true,
            trigger:'inputyear'
          },
          {
            id:'inputyear', 
            message:'Finally. what is you year?', 
            trigger:'year',
          },
          {
            id:'year', 
            user:true,
            trigger:'inputallergy'
          },
          {
            id:'inputallergy', 
            message:'Finally. what is you allergy?', 
            trigger:'allergy',
          },
          {
            id:'allergy', 
            user:true,
            trigger:'q-submit'
          },
          {
            id:'q-submit', 
            message:'Do you wish to submit?', 
            trigger:'submit'
          },
          {
            id:'submit', 
            options:[
            {value:'y', label:'Yes', trigger:'end-message'},
            {value:'n', label:'No', trigger:'no-submit'},
            ] 
          },
          {
                  id: 'no-submit',
                  message:'Your information was not submitted.', 
                  end: true,
               },
                    {
                  id: 'end-message',
                  component: <Post />,
                  asMessage: true,
                  end: true,
               },
        ]}
      />
        
        );
      }

    }

    export default SimpleForm;