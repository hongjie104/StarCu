package com.hj;

import android.content.ContentResolver;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Environment;
import android.provider.MediaStore;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Date;

/**
 * Created by lixiuzhi on 2016/3/14.
 */
public class ImageModule extends ReactContextBaseJavaModule {

    public ImageModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }


    /**
     * 压缩图片
     */
    @ReactMethod
    public void composeImage(String uri, int reqWidth, int reqHeight, Callback callback) {
        int quality = 100;
        String type = "jpg";
        String pathName = getRealFilePath(Uri.parse(uri));
        Bitmap b = createSampledBitmapFromFile(pathName, reqWidth, reqHeight);
        // 保存压缩之后的图
        String filePath = save(b, quality, type);

//        // 将大图删除
//        File file = new File(pathName);
//        if(file.exists()){
//            file.delete();
//        }

        if(filePath != null){
            callback.invoke(Uri.parse(filePath).toString());
        }
    }

    /**
     * Try to return the absolute file path from the given Uri
     *
     * @param uri
     * @return the file path or null
     */
    private String getRealFilePath(final Uri uri) {
        if (null == uri) return null;
        final String scheme = uri.getScheme();
        String data = null;
        if (scheme == null) {
            data = uri.getPath();
        } else if (ContentResolver.SCHEME_FILE.equals(scheme)) {
            data = uri.getPath();
        } else if (ContentResolver.SCHEME_CONTENT.equals(scheme)) {
            Cursor cursor = this.getCurrentActivity().getContentResolver().query(uri, new String[]{MediaStore.Images.ImageColumns.DATA}, null, null, null);
            if (null != cursor) {
                if (cursor.moveToFirst()) {
                    int index = cursor.getColumnIndex(MediaStore.Images.ImageColumns.DATA);
                    if (index > -1) {
                        data = cursor.getString(index);
                    }
                }
                cursor.close();
            }
        }
        return data;
    }

    /**
     * 压缩图片
     * @param pathName
     * @return
     */
    private Bitmap createSampledBitmapFromFile(String pathName, int reqWidth, int reqHeight) {
        final BitmapFactory.Options options = new BitmapFactory.Options();
        options.inJustDecodeBounds = true;
        BitmapFactory.decodeFile(pathName, options);
        options.inSampleSize = calculateInSampleSize(options, reqWidth, reqHeight);
        options.inJustDecodeBounds = false;
        return BitmapFactory.decodeFile(pathName, options);
    }

    /**
     * 计算压缩比例
     * @param options
     * @return
     */
    private int calculateInSampleSize(BitmapFactory.Options options, int reqWidth, int reqHeight) {
        final int picheight = options.outHeight;
        final int picwidth = options.outWidth;

        int targetheight = picheight;
        int targetwidth = picwidth;
        int inSampleSize = 1;
        if (targetheight > reqHeight || targetwidth > reqWidth) {
            while (targetheight  >= reqHeight && targetwidth>= reqWidth) {
                inSampleSize += 1;
                targetheight = picheight / inSampleSize;
                targetwidth = picwidth / inSampleSize;
            }
        }

        return inSampleSize;
    }

    /**
     * 将bitmap以图片形式保存到sd卡中
     * @param bitmap
     */
    private String save(Bitmap bitmap, int quality, String type) {
        String target = null;
        if (Environment.getExternalStorageState().equals(Environment.MEDIA_MOUNTED)) {
            //sd卡根目录
            File sdFile = Environment.getExternalStorageDirectory().getAbsoluteFile();
            File file = new File(sdFile.toString(), "starCu");
            if (!file.exists()) {
                file.mkdir();
            }
            try {
                target = file + File.separator + new Date().getTime() + (type == "png" ? ".png" : ".jpg");
                BufferedOutputStream bos = new BufferedOutputStream(new FileOutputStream(new File(target)));
                bitmap.compress(type == "png" ? Bitmap.CompressFormat.PNG : Bitmap.CompressFormat.JPEG, quality, bos);
                bos.flush();
                bos.close();
                // bitmap.recycle();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return target;
    }

    @Override
    public String getName() {
        return "ImageModule";
    }
}
