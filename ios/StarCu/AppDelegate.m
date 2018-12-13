/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <MeiQiaSDK/MQManager.h>
#import <UMCommon/UMCommon.h>
#import "RCTSplashScreen.h"

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  #pragma mark 美洽SDK  集成第一步: 初始化,  参数:appkey  ,尽可能早的初始化appkey.
  [MQManager initWithAppkey:@"319f14696c1359601a0014fcb14fca3f" completion:^(NSString *clientId, NSError *error) {
    if (!error) {
      NSLog(@"美洽 SDK：初始化成功");
    } else {
      NSLog(@"error:%@",error);
    }
  }];
  
  // 初始化友盟
  [UMConfigure initWithAppkey:@"5beba697f1f556e30c000349" channel:@"App Store"];
  
  NSURL *jsCodeLocation;

  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"StarCu"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  //[RCTSplashScreen open:rootView];
  [RCTSplashScreen open:rootView withImageNamed:@"splash"];

  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  return YES;
}

- (void)applicationWillEnterForeground:(UIApplication *)application {
#pragma mark 美洽SDK  集成第二步: 进入前台 打开meiqia服务
  [MQManager openMeiqiaService];
}
- (void)applicationDidEnterBackground:(UIApplication *)application {
#pragma mark 美洽SDK  集成第三步: 进入后台 关闭美洽服务
  [MQManager closeMeiqiaService];
}
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
#pragma mark 美洽SDK  集成第四步: 上传设备deviceToken
  [MQManager registerDeviceToken:deviceToken];
}

@end
