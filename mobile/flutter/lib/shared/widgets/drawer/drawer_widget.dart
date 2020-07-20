import 'package:enterprise/generated/l10n.dart';
import 'package:enterprise/routes.dart';
import 'package:enterprise/shared/bloc/bloc_provider.dart';
import 'package:enterprise/shared/widgets/drawer/drawer_bloc.dart';
import 'package:flutter/material.dart';

class EnterpriseDrawer extends StatelessWidget {
   EnterpriseDrawer({Key key}) : super(key: key);

  static final double iconSize = 30;

  @override
  Widget build(BuildContext context) {
    final drawerBloc = BlocProvider.of<EnterpriseDrawerBloc>(context);
    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: <Widget>[
          header(context),
          ListTile(
             leading: Icon(Icons.home, size: iconSize,),
             title: Text(S.of(context).drawerMenuMain),
             onTap: () => Navigator.pushNamed(context, EnterpriseRoutes.main),
          ),
          ListTile(
            leading: Icon(Icons.settings, size: iconSize,),
            title: Text(S.of(context).drawerSettingsTitle),
             onTap: () => Navigator.pushNamed(context, EnterpriseRoutes.settings),
          ),
          ListTile(
            leading: Icon(Icons.exit_to_app, size: iconSize,),
            title: Text(S.of(context).drawerLogoutTitle),
            onTap: () => onSignOut(drawerBloc, context),
          )
        ],
      ),
    );
  }

  onSignOut(EnterpriseDrawerBloc drawerBloc, BuildContext context) {
    drawerBloc.changeSignOut(true);
    Navigator.popUntil(context, ModalRoute.withName(EnterpriseRoutes.login));
    Navigator.pushNamed(context, EnterpriseRoutes.login);
  }

  Widget header(BuildContext context) {
    return DrawerHeader(
      decoration: BoxDecoration(
        color: Theme.of(context).primaryColor,
      ),
      child: Text(S.of(context).drawerMenuTitle,
        textAlign: TextAlign.center,
        style: Theme.of(context).textTheme.headline2),
    );
  }
}
