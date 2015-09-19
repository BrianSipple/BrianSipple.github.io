var compose = function compose(target) {

        // ECMAScript 5+ supported! -- we can clone property
        // descriptions as well
        var descriptorCloningEnabled = !!(Object.getOwnPropertyDescriptor);

        var objects = [].slice.call(arguments, 1);

        // Iterate through each object passed in after "target", cloning
        // its properties to "target"
        if (objects.length > 0) {
            objects.forEach(function (obj) {

                if (descriptorCloningEnabled) {

                    // NOTE: Keep in mind that Object.keys() returns only
                    // enumerable properties. If we want to also copy
                    // over nonenumerable properties, we can use
                    // Object.getOwnPropertyNames() instead.
                    Object.keys(obj).forEach(function (prop) {

                        var descriptor =
                            Object.getOwnPropertyDescriptor(obj, prop);

                        Object.defineProperty(target, prop, descriptor);
                    });

                } else {  // fallback to cloning properties only

                    for (var prop in obj) {

                        if (obj.hasOwnProperty(prop)) {
                            target[prop] = obj[prop];
                        }
                    }
                }
            });
        }

        return target;
    };

module.exports = compose;
