//
//  ImageModule.m
//  StarCu
//
//  Created by hongjie on 2019/1/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "ImageModule.h"
#import <AssetsLibrary/AssetsLibrary.h>

@interface ImageModule ()
@property (nonatomic, strong) RCTResponseSenderBlock saveImageCallBack;

@end

@implementation ImageModule

RCT_EXPORT_MODULE();

//清理缓存，以防程序奔溃
RCT_EXPORT_METHOD(clearImage:(NSString *)uri){
  NSString *documentPath = [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory,  NSUserDomainMask, YES) firstObject];
  NSString *imagesPath = [documentPath stringByAppendingPathComponent:@"starCu"];
  NSFileManager *fileMgr=[NSFileManager defaultManager];
  BOOL clear=[fileMgr removeItemAtPath:imagesPath error:nil];
  if (clear!=YES) {
    NSLog(@"该文件夹不能被清空");
  }else{
    NSLog(@"文件夹已清空");
  }
}

//压缩图片
#define MAXWIDTH 200.0
#define MAXHEIGHT 400.0
- (UIImage *)resizeImage:(UIImage *)image width:(float)width height:(float)height
{
  CGFloat scale = 1;
  CGSize reSize = image.size;
  if (reSize.width > width) {
    scale = width / reSize.width;
    reSize = CGSizeMake(image.size.width * scale, image.size.height * scale);
  }
  
  if (reSize.height > height) {
    scale = height / reSize.height;
    reSize = CGSizeMake(reSize.width * scale, reSize.height * scale);
  }
  
  
  if (reSize.height < 1) {
    reSize.height = 1;
  }
  if (reSize.width < 1) {
    reSize.width = 1;
  }
  
  UIGraphicsBeginImageContext(reSize);
  [image drawInRect:CGRectMake(0, 0, reSize.width, reSize.height)];
  UIImage *scaledImage = UIGraphicsGetImageFromCurrentImageContext();
  UIGraphicsEndImageContext();
  return scaledImage;
}



//s压缩图片处理
RCT_EXPORT_METHOD(composeImage:(NSString *)imgUri width:(float)width height:(float)height  Callback:(RCTResponseSenderBlock)callback)
{
  //帖子左边的图片
  UIImage *targetImg=[UIImage imageWithData:[NSData dataWithContentsOfURL:[NSURL URLWithString:imgUri]]];
  
  //存储前压缩图片
  UIImage *image=[self resizeImage:targetImg width:width height:height];
  //本地存储路径
  NSString *documentPath = [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory,  NSUserDomainMask, YES) firstObject];
  //创建一个nspole文件夹
  NSString *imagesPath = [documentPath stringByAppendingPathComponent:@"starCu"];
  //文件名称
  NSString *filepath = [imagesPath stringByAppendingPathComponent:[NSString stringWithFormat:@"%zd.%@",(NSInteger)([[NSDate date] timeIntervalSince1970] * 1000),@"jpg"]];//图片名以时间命名
  NSData *imageData=UIImageJPEGRepresentation(image,100.0);
  [[NSFileManager defaultManager] createDirectoryAtPath:imagesPath attributes:nil];
  //将图片数据写入
  [imageData writeToFile:filepath atomically:YES];
  callback(@[filepath]);
}

@end
