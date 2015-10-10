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
                <Comment author={comment.author}>
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
    handleSubmit: function(e){
        e.preventDefault();
        var author = this.refs.author.getDOMNode().value.trim();
        var text = this.refs.text.getDOMNode().value.trim();
        if(!text||!author){
            return;
        }
        // TODO: send request to the server
        this.props.onCommentSubmit({author:author,text:text});
        this.refs.author.getDOMNode().value = '';
        this.refs.text.getDOMNode().value = '';
        return;
    },
    render: function(){
        // define event handler by camel type name "onSubmit"
        // define ref for sub component which can used by this.refs
        // this.refs.xxx.getDOMNode() can get DOM element
        return (
            <form className="commentForm" onSubmit={this.handleSubmit}>
                <input type="text" placeholder="Your name" ref="author"/>
                <input type="text" placeholder="Say something..." ref="text"/>
                <input type="submit" value="Post"/>
            </form>
        );
    }
});

// define a component
var CommentBox = React.createClass({
    loadCommentsFromServer: function(){
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            success:function(data){
                this.setState({data:data});
            }.bind(this),
            error: function(xhr,status,err){
                console.error(this.props.url,status,err.toString());
            }.bind(this)
        });
    },
    handleCommentSubmit: function(comment){
        // TODO: submit to the server and refresh the list
        var comments = this.state.data;
        var newComments = comments.concat([comment]);
        this.setState({data:newComments});
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            type: 'POST',
            data: comment,
            success: function(data){
                this.setState({data:data});
            }.bind(this),
            error: function(xhr,status,err){
                console.error(this.props.url,status,err.toString()); 
            }.bind(this)
        });
    },
    // getInitialState will only invoke once to init the component state
    getInitialState: function(){
        return {data:[]};
    },
    // componentDidMount will invoke when the component render
    componentDidMount: function(){
        this.loadCommentsFromServer();
        setInterval(this.loadCommentsFromServer,this.props.pollInterval);
        // $.ajax({
        //     url: this.props.url,
        //     dataType: 'json',
        //     success:function(data){
        //         this.setState({data:data});
        //     }.bind(this),
        //     error: function(xhr,status,err){
        //         console.error(this.props.url,status,err.toString());
        //     }.bind(this)
        // });
    },
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
                <CommentForm onCommentSubmit={this.handleCommentSubmit}/>
            </div>        
        );
    }
});
// here is which element to render the component
React.render(
    <CommentBox url="http://localhost:5000/api/comments" pollInterval={2000} data={data}/>,
    document.getElementById('content')
);

