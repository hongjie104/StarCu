//
//  UMengModule.m
//  StarCu
//
//  Created by Hongjie Zhou on 2018/11/14.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "UMengModule.h"
#import <UMCommon/UMCommon.h>
#import <UMAnalytics/MobClick.h>

@implementation UMengModule

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(onEvent:(NSString *)eventID){
  [MobClick event:eventID];
}

RCT_EXPORT_METHOD(onEventWithLabel:(NSString *)eventID EvnetLabel:(NSString *)EvnetLabel){
  [MobClick event:eventID label:EvnetLabel];
}

@end
