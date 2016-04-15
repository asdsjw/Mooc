//
//  JavascriptTools.swift
//  Mooc
//
//  Created by asdsjw on 16/4/13.
//  Copyright © 2016年 sunjunwei. All rights reserved.
//

import UIKit
import TVMLKit
@objc protocol ToolsJSEports: JSExport{
    func httpGet(urlString: String) -> String
    func httpGet(urlString: String, Referer: String) -> String
    func courseList(urlString: String,FistIndex: Int) -> String
    func regexGet(Content: String, Format: String) -> String
    func searchResult(urlString: String,FistIndex: Int) -> String
    func getSearchCount() -> Int
}

@objc class JavascriptTools:NSObject, ToolsJSEports {

     var searchInt = 0
     func httpGet(urlString: String) -> String {
        var resultStr = ""
        let semaphore = dispatch_semaphore_create(0);
        let url = NSURL(string: urlString)
        let request = NSMutableURLRequest(URL: url!)
        request.HTTPMethod="GET"
        
        request.setValue("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/601.5.17 (KHTML, like Gecko) Version/9.1 Safari/601.5.17", forHTTPHeaderField: "User-Agent")
        request.setValue("gzip, deflate", forHTTPHeaderField: "Accept-Encoding")
        request.setValue("zh-cn", forHTTPHeaderField: "Accept-Language")
        let session = NSURLSession.sharedSession()
        let task = session.dataTaskWithRequest(request, completionHandler:{(data, response, error) -> Void in
            if (data != nil) {
                resultStr = String(data: data!, encoding: NSUTF8StringEncoding)!
            }else {
                resultStr = String(error?.code)
            }

            dispatch_semaphore_signal(semaphore);
        })
        task.resume()
        dispatch_semaphore_wait(semaphore, DISPATCH_TIME_FOREVER);
        return resultStr
    }
    
    func courseList(urlString: String,FistIndex: Int) -> String {
        searchInt = 0;
        let courseHtml = httpGet(urlString)
        var totalInt = FistIndex;
        var resultString = String()
        do {
            let pattern = "<a href=\"(.*)\" target=\"_self\">\\s*<div class=\"course-list-img\">\\s*<img width=\"240\" height=\"135\" alt=\"(.*)\" src=\"(.*)\">\\s*</div>\\s*<h5>\\s*<span>(.*)</span>\\s*</h5>\\s*<div class=\"tips\">\\s*<p class=\"text-ellipsis\">(.*)</p>\\s*<span class=\"(.*)\">(.*)</span>"
            let regex = try NSRegularExpression(pattern: pattern, options: NSRegularExpressionOptions.CaseInsensitive)
            let res = regex.matchesInString(courseHtml, options:[], range: NSMakeRange(0, courseHtml.characters.count))
            for checkingRes in res {
                let href = (courseHtml as NSString).substringWithRange(checkingRes.rangeAtIndex(1))
                let title = (courseHtml as NSString).substringWithRange(checkingRes.rangeAtIndex(2))
                let imgUrl = (courseHtml as NSString).substringWithRange(checkingRes.rangeAtIndex(3))
                let subtitle = (courseHtml as NSString).substringWithRange(checkingRes.rangeAtIndex(7))
                resultString += "<lockup id=\"\(totalInt)\" onselect=\"detailMK('\(href)')\"><img src=\"\(imgUrl)\" width=\"300\" height=\"169\" /><title class=\"scrollTextOnHighlight\"><![CDATA[\(title)]]></title><subtitle class=\"textAlign\">\(subtitle)</subtitle></lockup>"
                totalInt+=1
                searchInt+=1
            }
        }catch let error as NSError {
            print(error)
        }
        return resultString
    }
    
    func searchResult(urlString: String,FistIndex: Int) -> String {
        searchInt=0;
        var totalInt = FistIndex;
        let courseHtml = urlString
        var resultString = String()
        do {
            let pattern = "<h2 class=\"title autowrap\"><a href=\"(.*)\" target=\"_blank\">(.*)</a></h2>"
            let regex = try NSRegularExpression(pattern: pattern, options: NSRegularExpressionOptions.CaseInsensitive)
            let res = regex.matchesInString(courseHtml, options:[], range: NSMakeRange(0, courseHtml.characters.count))
            for checkingRes in res {
                let href = (courseHtml as NSString).substringWithRange(checkingRes.rangeAtIndex(1))
                var title = (courseHtml as NSString).substringWithRange(checkingRes.rangeAtIndex(2))
                title = title.stringByReplacingOccurrencesOfString("<span class=\"highlight\">", withString: "")
                title = title.stringByReplacingOccurrencesOfString("</span>", withString: "")
                title = title.stringByReplacingOccurrencesOfString("&mdash;", withString: "-")
                title = title.stringByReplacingOccurrencesOfString("&ldquo;", withString: " ")
                resultString += "<listItemLockup id=\"\(totalInt)\" onselect=\"detailMK('\(href)')\"><title><![CDATA[\(title)]]></title></listItemLockup>"
                searchInt+=1
                totalInt+=1
            }
        }catch let error as NSError {
            print(error)
        }
        return resultString
    }
    
    func httpGet(urlString: String, Referer: String) -> String {
  
        var resultStr = ""
        let semaphore = dispatch_semaphore_create(0);
        let url = NSURL(string: urlString)
        let request = NSMutableURLRequest(URL: url!)
        request.HTTPMethod="GET"
        request.setValue(Referer, forHTTPHeaderField: "Referer")
        request.setValue("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/601.5.17 (KHTML, like Gecko) Version/9.1 Safari/601.5.17", forHTTPHeaderField: "User-Agent")
        request.setValue("gzip, deflate", forHTTPHeaderField: "Accept-Encoding")
        request.setValue("zh-cn", forHTTPHeaderField: "Accept-Language")
        let session = NSURLSession.sharedSession()
        let task = session.dataTaskWithRequest(request, completionHandler:{(data, response, error) -> Void in
            if (data != nil) {
                resultStr = String(data: data!, encoding: NSUTF8StringEncoding)!
            }else {
                resultStr = String(error?.code)
            }
            
            dispatch_semaphore_signal(semaphore);
        })
        task.resume()
        dispatch_semaphore_wait(semaphore, DISPATCH_TIME_FOREVER);
        return resultStr
    }
    
    func regexGet(Content: String, Format: String) -> String {
        var resultStr = ""
        do
        {
            let regex = try NSRegularExpression(pattern: Format, options: NSRegularExpressionOptions.CaseInsensitive)
            let firstMatch = regex.firstMatchInString(Content, options: [], range: NSMakeRange(0, Content.characters.count))
            if (firstMatch != nil) {
                let range = firstMatch!.rangeAtIndex(1)
                resultStr = (Content as NSString).substringWithRange(range).stringByTrimmingCharactersInSet(NSCharacterSet.whitespaceAndNewlineCharacterSet())
            }
        }catch let error as NSError{
            print(error)
        }
        return resultStr
    }
    
    func getSearchCount() -> Int {
        return searchInt
    }
}

