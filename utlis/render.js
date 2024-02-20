export const renderHomepage = (req, res, btn_name, btn_link, UserInfo) => {

    // res.render('index-2', { btn_name: "Sign In", btn_link: '/login.html', UserInfo: 'Explore the world with comfortable car' })
    res.render('index-2', { btn_name, btn_link, UserInfo })
}
