function iterateComments(index, comment, archived, $element) {
    const $collapsed = renderCollapsedComment(comment);
    const $comment = renderComment(comment, archived);
    if (comment.replies.length > 0) {
        $comment.append('<ul>');
        let $children = $comment.children('ul');
        $.each(comment.replies, (index, child) => {
            iterateComments(index, child, archived, $children);
        });
        $comment.append($children);
    }
    $element.append($collapsed).append($comment);
}

function renderCollapsedComment(comment) {
    return $(`
    <li class="s136il31-0 cMWqxb" id="${comment.id}-collapsed" tabindex="-1" style="display:none">
        <div class="Comment ${comment.id} c497l3-5 MAIAY">
            <button class="${comment.id} c497l3-0 jtKgEe">
                <i class="icon icon-expand qjrkk1-0 JnYFK"></i>
            </button>
            <div class="c497l3-4 bWacBs">
                <div class="c497l3-3 cFXBbI">
                    <div>
                        <a class="s1461iz-1 RVnoX" href="https://www.reddit.com/user/${comment.author}" target="_blank">${comment.author}</a>
                    </div>
                    <span class="h5svje-0 cFQOcm">${numToString(comment.score)} points</span>
                    <span class="h5svje-0 cFQOcm"> &middot; </span>
                    <a class="s17xjtj0-13 hsxhRU" href="https://www.reddit.com/${comment.permalink}" id="CommentTopMeta--Created--t1_e7i7pcvinOverlay" rel="nofollow" target="_blank">
                        <span>${getAge(comment.created_utc)}</span>
                    </a>
                </div>
            </div>
        </div>
    </li>
    `)
}

function renderComment(comment, archived) {
    const commentModel = new ContentModel(comment);
    commentModel.replyable_content_type = 'comment';
    let $comment = $(`
    <li id='${comment.id}' class="s136il31-0 cMWqxb" tabindex="-1">
        <div class="fxv3b9-1 jDSCcP">
            <div class="fxv3b9-2 czhQfm">
                <div class="${comment.id} fxv3b9-0 efNcNS"><i class="threadline"></i></div>
            </div>
        </div>
        <div class="Comment ${comment.id} c497l3-5 MAIAY">
            <div class="comment_vote">
            </div>
            <div class="c497l3-4 jHfOJm">
                <span class="s1dqr9jy-0 imyGpC">level 1</span>
                <div class="c497l3-3 clkVGJ s17xjtj0-21 heFPGG">
                    <div class="wx076j-0 hPglCh">
                        <a class="s1461iz-1 RVnoX" href="https://www.reddit.com/user/${comment.author}" target="_blank">${comment.author}</a>
                    </div>
                    <span class="h5svje-0 cFQOcm">${numToString(comment.score)} points</span>
                    <span class="h5svje-0 cFQOcm"> &middot; </span>
                    <a class="s17xjtj0-13 hsxhRU" href="https://www.reddit.com/${comment.permalink}" id="CommentTopMeta--Created--t1_e7i7pcvinOverlay" rel="nofollow" target="_blank">
                        <span>${getAge(comment.created_utc)}</span>
                    </a>
                </div>
                <div>
                    <div class="c497l3-6 eCeBkc s1hmcfrd-0 ckueCN">
                        ${comment.body_html}
                    </div>
                    <div>
                        <div class="s5kaj4p-8 dtnsqo">
                            ${archived ? "":
                                `<button class="s5kaj4p-9 hNSNDN reply_button">
                                    <i class="icon icon-comment _3ch9jJ0painNf41PmU4F9i s5kaj4p-0 domCcm"></i>Reply
                                </button>`
                            }
                            <div class="comment_buttons"></div>
                        </div>
                    </div>
                    <form></form>
                </div>
            </div>
            <form></form>
        </div>
    </li>`);
    let $vote_arrows_div = $comment.find('.comment_vote');
        vote_arrows_dom = document.createElement('div');
        $buttons_div = $comment.find('.comment_buttons');
        buttons_dom = document.createElement('div');
    $vote_arrows_div.append(vote_arrows_dom);
    $buttons_div.append(buttons_dom);
    ReactDOM.render(
        React.createElement(CommentVote, commentModel),
        vote_arrows_dom
    );
    ReactDOM.render(
        React.createElement(CommentButtons, commentModel),
        buttons_dom
    );
    return $comment;
}

function appendComment(index, comment, archived, $element) {
    iterateComments(index, comment, archived, $element);

    $('.reply_button').off('click').click(function() {
        const $this = $( this );
        logInReddit(function(status) {
            var comment_id = $this.closest('li').attr('id');
            const $form = $this.parents().eq(1).siblings('form');;
            displayReplyComment(comment_id, $form, 'comment');
        });
    });
    $('.threadline').off('click').click(function() {
        const comment_id = $( this ).parent()[0].classList[0];
        $('#' + comment_id).hide();
        $('#' + comment_id + '-collapsed').show();
    });
    $('.icon-expand').off('click').click(function() {
        const comment_id = $( this ).parent()[0].classList[0];
        $('#' + comment_id).show();
        $('#' + comment_id + '-collapsed').hide();
    });

    $('.ckueCN a').each(function () {
        $( this ).attr('title', $( this ).attr('href'));
    });
}

function makeDisplay(submission) {
    var redditComments = submission.comments;
    var archived = submission.archived;
    var submission_id = submission.id;
    const submissionModel = new ContentModel(submission);
    submissionModel.replyable_content_type = 'submission';

    if (archived) {
        $("#archived").show();
    }

    if (redditComments.length > 0) {
        $.each(redditComments, function(index, comment) {
            appendComment(index, comment, archived, $('#comments'));
        });

    } else {
        $("#no_results").show();
    }

    if (!archived) {
        const $form = $('#reply_post');
        $form.click(function () {
            logInReddit(status => {});
        });
        displayReplyComment(submission_id, $form, 'submission');
    }
    ReactDOM.render(
        React.createElement(SubmissionExpand, submissionModel),
        document.getElementById('post'));
    $('.ckueCN a').each(function () {
        $( this ).attr('title', $( this ).attr('href'));
    });
    scrollToSearchResult();
    $("#loading").hide();
}

function scrollToSearchResult() {
    const fragment = new URI(window.location.href).fragment();
    if (fragment) {
        const search_result_elem = document.getElementById(fragment);
        if (search_result_elem) {
            search_result_elem.scrollIntoView({
                behavior: 'smooth'
            });
            search_result_elem.style.backgroundColor = '#E6F7FA';
        } else {
            $('#element_not_found').show();
        }

    }
}

function displayReplyComment(comment_id, $form, replyable_content_type) {
    if ($form.children().length == 0) {
        $form.append(renderReplyComment(comment_id, replyable_content_type));
        const converter = new Markdown.getSanitizingConverter();
        const editor = new Markdown.Editor(converter, '-' + comment_id);
        editor.run();
        // TODO: better handling of this function
        $('.cancel_reply').click(function(event) {
            const $this = $( this );
            event.preventDefault();
            $this.closest('form').toggle();
        });
        // TODO: better handling of this function
        $form.submit(function(event) {
            event.preventDefault();
            $form.find('button').prop('disabled', true);
            leaveComment(comment_id,
                $(`#wmd-input-${comment_id}`).val(),
                replyable_content_type,
                function (response) {
                    $form.find('button').prop('disabled', false);
                    if (response.id) {
                        if (replyable_content_type === 'comment') {
                            $form.hide(0);
                        }
                        $(`#wmd-input-${comment_id}`).val('');
                        $(`#wmd-preview-${comment_id}`).html('');
                        const parent_id = comment_id;
                        let $parent;
                        if (replyable_content_type == 'comment') {
                            if ($('#' + parent_id).children('ul').length == 0) {
                                $('#' + parent_id).append('<ul></ul>');
                            }
                            $parent = $('#' + parent_id).children('ul');
                        } else if (replyable_content_type == 'submission') {
                            $parent = $('<ul>');
                            $('#comments').prepend($parent);  // new comment is at top of thread
                        }
                        appendComment(-1, response, false, $parent);
                        // TODO: individual status div per reply box
                        $("#status").html("<span>Successful post</span>")
                    } else {
                        // TODO: better error handling
                        if (replyable_content_type === 'comment') {
                            $form.hide(0);
                        }
                        $("#status").html(`<span>${response}</span>`);
                        console.log('Status of failed post:');
                        console.log(response);
                }
            });
        });
    } else {
        $form.toggle();
    }
}

function renderReplyComment(comment_id, replyable_content_type) {
    return `
        <div id="wmd-button-bar-${comment_id}"></div>
        <textarea id="wmd-input-${comment_id}" class="wmd-input" placeholder="Write your comment here using Markdown. You'll see a live preview of how your comment will look below this box."></textarea>
        <div class="jvfwx7-0 gJASDC">
            <div class="s1ly6fn0-7 dxkxnq">
                <div class="s1htkqit-0 dkOnao">
                    <div class="s1l8ionp-0 dmKBhh">
                        <div class="s1ly6fn0-0 knfJib">
                            Live Preview
                        </div>
                    </div>
                </div>
                <div class="s1ly6fn0-9 btsuju">
                    <div id="wmd-preview-${comment_id}" class="wmd-panel wmd-preview"></div>
                </div>
            </div>
        </div>
        <div class="s1htkqit-4 kALOUK">
            <button class="s1htkqit-1 htkhll" type="submit">Reply</button>
            ${replyable_content_type=='comment' ? `
                <button class="s1htkqit-3 lcYWzy cancel_reply" type="reset">
                    CANCEL
                </button>`: ''
            }
        </div>
        `;
}

$(document).ready(function(){
    $('#back_button').click(() => window.history.back());
    var window_url = new URI(window.location.href);
    var query = window_url.search(true);

    var submission = SubmissionLscache.get(query.id) || {};
    if ((submission.comments && submission.comments.length > 0) ||
        query.num_comments === 0) {
        makeDisplay(submission);
    } else {
        getSubmission(query.id, makeDisplay);
    }

});
