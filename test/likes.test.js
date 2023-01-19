const listHelper = require('../utils/list_helper')

describe('total likes', ()=>{
    test('of empty list is zero', ()=>{
        const blogs = []
        expect(listHelper.totalLikes(blogs)).toBe(0)
    })
    test('when list has only one blog, equals the likes of that', ()=>{
        const blogs = [{
        "_id": "63c8576daa8cf7c2e3306f5b",
        "title": "first blog",
        "author": "unknown",
        "url": "www.unkown.com",
        "likes": 12,
        "__v": 0
    }]
        expect(listHelper.totalLikes(blogs)).toBe(12)
    })
    test('of a bigger list is calculated right', ()=>{
        const blogs = [{
        "_id": "63c8576daa8cf7c2e3306f5b",
        "title": "first blog",
        "author": "unknown",
        "url": "www.unkown.com",
        "likes": 12,
        "__v": 0
    },
    {
        "_id": "63c85d9df3ffa283093be51d",
        "title": "second blog",
        "author": "unknown",
        "url": "www.unkown.com",
        "likes": 10,
        "__v": 0
    },
    {
        "_id": "63c85e6770510141c45a58fc",
        "title": "third blog",
        "author": "unknown",
        "url": "www.unkown.com",
        "likes": 8,
        "__v": 0
    },]
        expect(listHelper.totalLikes(blogs)).toBe(30)
    })
})

