export const paths = {
  homePath() {
    return "/";
  },
  topicShowPath(topicSlug: string) {
    return `/topics/${topicSlug}`; // slug is a wildcard
  },
  postCreatePath(topicSlug: string) {
    return `/topics/${topicSlug}/posts/new`;
  },
  postShowPath(topicSlug: string, postId: string) {
    return `/topics/${topicSlug}/posts/${postId}`;
  },
};
