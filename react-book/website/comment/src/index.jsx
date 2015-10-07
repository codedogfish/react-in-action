var data = [
    {author: "Jack Yu", text: "This is one comment"},
    {author: "Jessie Lin", text: "This is *another* comment"}
];
var converter = new showdown.Converter();
var Comment = React.createClass({
    render: function(){
        var rawMarkup = converter.makeHtml(this.props.children.toString());
        return (
            <div className="comment">
                <h2 className="commentAuthor">
                    {this.props.author}
                </h2>
                <span dangerouslySetInnerHTML={{__html: rawMarkup}}></span>
            </div>        
        );
    }
});

var CommentList = React.createClass({
    render: function(){
        console.log(this.props.data);
        var commentNodes = this.props.data.map(function(comment){
            return (
                <Comment author="comment.author">
                    {comment.text}
                </Comment>        
            );
        });
        // // author="Jack Yu" => #6 this.props.author
        // // This is one comment => #8 this.props.children
        // return (
        //     <div className="commentList">
        //         <Comment author="Jack Yu">This is one comment</Comment>
        //         <Comment author="Jessie Lin">This is *another* comment</Comment>
        //     </div>        
        // );
        return (
            <div className="commentList">
                {commentNodes}
            </div>        
        );
    }
});

var CommentForm = React.createClass({
    render: function(){
        return (
            <div className="commentForm">
                Hello, world! I am a CommentForm.
            </div>
        );
    }
});

// define a component
var CommentBox = React.createClass({
    // getInitialState will only invoke once to init the component state
    getInitialState: function(){
        return {data:[]};
    },
    //componentDidMount: function(){
    //    $.ajax({
    //        url: this.props.url,
    //        dataType: 'json',
    //        success:function(data){
    //            this.setState({data:data});
    //        }.bind(this),
    //        error: function(){
    //            console.error(this.props.url,status,err.toString());
    //        }.bind(this)
    //    });
    //},
    // here is how to render the component
    render: function(){
        // return (
        //     <div className="commentBox">
        //         <h1>Comments</h1>
        //         <CommentList data={this.props.data}/>
        //         <CommentForm />
        //     </div>        
        // );
        return (
            <div className="commentBox">
                <h1>Comments</h1>
                <CommentList data={this.state.data}/>
                <CommentForm/>
            </div>        
        );
    }
});
// here is which element to render the component
React.render(
    <CommentBox url="http://localhost:5000/api/comments" data={data}/>,
    document.getElementById('content')
);

