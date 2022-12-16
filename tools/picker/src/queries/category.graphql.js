const query = `query getCategory($uid: String!) {
    categories(filters: { category_uid: { eq: $uid } }) {
        items {
            name
            uid
            breadcrumbs {
                category_name
                category_uid
            }
        }
    }
}`;

export default query;
