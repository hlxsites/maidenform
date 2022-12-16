const query = `query getCategoriesInCategory($uid: String!) {
    categories(
        filters: { parent_category_uid: { eq: $uid } }
        pageSize: 20
        currentPage: 1
    ) {
        items {
            uid
            name
            product_count
            children_count
          __typename
        }
        page_info {
            current_page
            page_size
            total_pages
        }
        total_count
    }
}`;

export default query;
