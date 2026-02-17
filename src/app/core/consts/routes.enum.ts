export enum FeatureRoutesEnum {
  Products = 'products',
  ProductDetail = 'products/:id',
  Cart = 'cart',
}

export enum AuthRoutesEnum {
  Login = 'login',
  Register = 'register',
}

export type RoutesEnum = FeatureRoutesEnum | AuthRoutesEnum;

export const featureRoutes: RoutesEnum[] = [
  FeatureRoutesEnum.Products,
  FeatureRoutesEnum.ProductDetail,
  FeatureRoutesEnum.Cart,
];

export const authRoutes: RoutesEnum[] = [AuthRoutesEnum.Login, AuthRoutesEnum.Register];

export const allRoutes: RoutesEnum[] = [...featureRoutes, ...authRoutes];

export const isFeatureRoute = (route: RoutesEnum): route is FeatureRoutesEnum =>
  featureRoutes.includes(route);

export const isAuthRoute = (route: RoutesEnum): route is AuthRoutesEnum =>
  authRoutes.includes(route);
