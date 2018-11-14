//
//  MeiQiaModule.m
//  StarCu
//
//  Created by Hongjie Zhou on 2018/11/14.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "MeiQiaModule.h"
#import <React/RCTUtils.h>
#import <React/RCTLog.h>
#import <MeiQiaSDK/MeiQiaSDK.h>
#import "MQChatViewManager.h"

@implementation MeiQiaModule

RCT_EXPORT_MODULE();

// 设置客户信息
RCT_EXPORT_METHOD(setClientInfo:(NSDictionary *)attrs
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
  
  [MQManager setClientInfo:attrs completion:^(BOOL success, NSError *error) {
    if (error) {
      reject([NSString stringWithFormat:@"%ld", error.code], error.domain, error);
      return;
    }
    resolve(@{@"ok": @(1)});
  }];
}

RCT_EXPORT_METHOD(open) {
  UIViewController *presentingController = RCTPresentedViewController();
  if (presentingController == nil) {
    RCTLogError(@"Tried to display action sheet picker view but there is no application window.");
    return;
  }
  MQChatViewManager *chatViewManager = [[MQChatViewManager alloc] init];
  [chatViewManager enableSyncServerMessage:true];
  [chatViewManager presentMQChatViewControllerInViewController:presentingController];
}

@end
