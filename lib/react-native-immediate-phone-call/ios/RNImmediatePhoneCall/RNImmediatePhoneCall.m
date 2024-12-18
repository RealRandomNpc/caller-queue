#import <UIKit/UIKit.h>

#import "RCTBridgeModule.h"

@interface RNImmediatePhoneCall : NSObject <RCTBridgeModule>

@end

@implementation RNImmediatePhoneCall

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(immediatePhoneCall:(NSString *)number)

{

    NSString *phoneUrlString = [NSString stringWithFormat:@"tel:%@", number];

    NSURL *phoneUrl = [NSURL URLWithString:phoneUrlString];

    if ([[UIApplication sharedApplication] canOpenURL:phoneUrl]) {

        // Use the new open(_:options:completionHandler:) method

        [[UIApplication sharedApplication] openURL:phoneUrl options:@{} completionHandler:^(BOOL success) {

            if (!success) {

                NSLog(@"Failed to make the call.");

            }

        }];

    } else {

        NSLog(@"Cannot make phone call. Please check the number or the device capabilities.");

    }

}

@end

 