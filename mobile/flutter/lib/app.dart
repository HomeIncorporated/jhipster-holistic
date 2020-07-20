import 'package:enterprise/routes.dart';
import 'package:enterprise/shared/bloc/bloc_provider.dart';
import 'package:enterprise/main/main_bloc.dart';
import 'package:enterprise/main/main_screen.dart';
import 'package:enterprise/account/settings/settings_bloc.dart';
import 'package:enterprise/account/settings/settings_screen.dart';
import 'package:enterprise/themes.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

import 'package:flutter_localizations/flutter_localizations.dart';
import 'generated/l10n.dart';

import 'account/login/login_bloc.dart';
import 'account/login/login_screen.dart';
import 'account/register/register_bloc.dart';
import 'account/register/register_screen.dart';

class EnterpriseApp extends StatelessWidget {
  const EnterpriseApp({Key key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Jhipster flutter app',
      theme: Themes.jhLight,
      routes: {
        EnterpriseRoutes.login: (context) {
          return BlocProvider<LoginBloc>(bloc: LoginBloc(), child: LoginScreen());
        },
        EnterpriseRoutes.register: (context) {
          return BlocProvider<RegisterBloc>(
              bloc: RegisterBloc(), child: RegisterScreen());
        },
        EnterpriseRoutes.main: (context) {
          return BlocProvider<MainBloc>(
              bloc: MainBloc(), child: MainScreen());
        },
      EnterpriseRoutes.settings: (context) {
      return BlocProvider<SettingsBloc>(
        bloc: SettingsBloc(), child: SettingsScreen());
        },
      },
        localizationsDelegates: [
          S.delegate,
          GlobalMaterialLocalizations.delegate,
          GlobalWidgetsLocalizations.delegate,
          GlobalCupertinoLocalizations.delegate,
        ],
        supportedLocales: S.delegate.supportedLocales
    );
  }


}
